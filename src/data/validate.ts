/**
 * Runtime enforcement of the non-negotiable disciplines (BRIEF §7).
 * Violations are returned as human-readable strings and logged by App.
 */

import { MACRO_SITE_RELATIONS } from '../types/schema'
import { dataset } from './graph'

export function validateGraph(): string[] {
  const issues: string[] = []
  const ids = new Set<string>()
  const types = new Map<string, string>()

  for (const n of dataset.nodes) {
    if (ids.has(n.id)) issues.push(`duplicate node id: ${n.id}`)
    ids.add(n.id)
    types.set(n.id, n.type)
    if (!n.sources || n.sources.length === 0)
      issues.push(`node ${n.id}: empty sources[] (un-sourced data is a bug)`)
    for (const s of n.sources)
      if (!dataset.meta.bibliography[s])
        issues.push(`node ${n.id}: source key "${s}" missing from bibliography`)
    if (n.type === 'site' && (n.lat === undefined || n.lng === undefined))
      issues.push(`site ${n.id}: missing lat/lng (required for the map layer)`)
    if (
      n.date_start !== undefined &&
      n.date_end !== undefined &&
      n.date_start > n.date_end
    )
      issues.push(`node ${n.id}: date_start after date_end`)
    if ((n.date_start ?? -1) > 0 || (n.date_end ?? -1) > 0)
      issues.push(`node ${n.id}: BCE dates must be negative years`)
  }

  const edgeIds = new Set<string>()
  for (const e of dataset.edges) {
    if (edgeIds.has(e.id)) issues.push(`duplicate edge id: ${e.id}`)
    edgeIds.add(e.id)
    if (!ids.has(e.source)) issues.push(`edge ${e.id}: unknown source ${e.source}`)
    if (!ids.has(e.target)) issues.push(`edge ${e.id}: unknown target ${e.target}`)
    if (!e.sources || e.sources.length === 0)
      issues.push(`edge ${e.id}: empty sources[] (un-sourced data is a bug)`)
    for (const s of e.sources)
      if (!dataset.meta.bibliography[s])
        issues.push(`edge ${e.id}: source key "${s}" missing from bibliography`)
    // No continuity claims: two sites may only be joined by corridor/compares_with.
    if (
      types.get(e.source) === 'site' &&
      types.get(e.target) === 'site' &&
      !MACRO_SITE_RELATIONS.has(e.relation)
    )
      issues.push(
        `edge ${e.id}: site-to-site relation "${e.relation}" is forbidden (corridor/compares_with only)`,
      )
  }

  return issues
}

/** Count of records (nodes + edges) that carry at least one source. */
export function sourcedRecordCount(): { sourced: number; total: number } {
  const records = [...dataset.nodes, ...dataset.edges]
  return {
    sourced: records.filter((r) => r.sources.length > 0).length,
    total: records.length,
  }
}

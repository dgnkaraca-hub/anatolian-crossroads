/**
 * Runtime enforcement of the non-negotiable disciplines (BRIEF §7).
 * Violations are returned as human-readable strings and logged by App.
 */

import { MACRO_SITE_RELATIONS } from '../types/schema'
import { MODULES, dataset } from './graph'
import { BRIDGE } from './bridge'
import { STORIES } from './stories'

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

/**
 * Story routes must stay consistent with the graph: every step focuses an
 * existing node, cites known bibliography keys, and keeps its year inside
 * the macro span (or null for the full range).
 */
export function validateStories(): string[] {
  const issues: string[] = []
  const nodeIds = new Set(dataset.nodes.map((n) => n.id))
  const storyIds = new Set<string>()

  for (const story of STORIES) {
    if (storyIds.has(story.id)) issues.push(`duplicate story id: ${story.id}`)
    storyIds.add(story.id)
    if (story.steps.length === 0) issues.push(`story ${story.id}: no steps`)
    story.steps.forEach((step, i) => {
      const at = `story ${story.id} step ${i + 1}`
      if (!nodeIds.has(step.focus)) issues.push(`${at}: unknown focus node ${step.focus}`)
      if (step.conceptFocus && !nodeIds.has(step.conceptFocus))
        issues.push(`${at}: unknown conceptFocus ${step.conceptFocus}`)
      if (step.year !== null && (step.year < -9600 || step.year > -700))
        issues.push(`${at}: year ${step.year} outside macro span (-9600..-700)`)
      if (step.sources.length === 0)
        issues.push(`${at}: empty sources[] (un-sourced narrative is a bug)`)
      for (const s of step.sources)
        if (!dataset.meta.bibliography[s])
          issues.push(`${at}: source key "${s}" missing from bibliography`)
    })
  }
  return issues
}

/**
 * Bridge entries must point at existing macro nodes and known modules, and
 * stay sourced like every other record. (Record ids inside the modules are
 * checked against the sibling datasets by scripts/check-bridge.mjs.)
 */
export function validateBridge(): string[] {
  const issues: string[] = []
  const nodeIds = new Set(dataset.nodes.map((n) => n.id))
  BRIDGE.forEach((b, i) => {
    const at = `bridge[${i}] (${b.module}:${b.record})`
    if (!nodeIds.has(b.macro)) issues.push(`${at}: unknown macro node ${b.macro}`)
    if (!MODULES[b.module]) issues.push(`${at}: unknown module ${b.module}`)
    if (!b.sources || b.sources.length === 0)
      issues.push(`${at}: empty sources[] (un-sourced data is a bug)`)
    if (!b.label_en || !b.label_tr) issues.push(`${at}: missing bilingual labels`)
  })
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

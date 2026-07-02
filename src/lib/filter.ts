/**
 * Filter model shared by the map and the network views.
 *
 * Time filtering is a highlight, not a hard filter: sites outside the active
 * year dim rather than disappear, so the atlas never loses its shape.
 */

import type { Confidence, EvidenceType, GraphEdge, GraphNode, NodeType } from '../types/schema'
import { dataset } from '../data/graph'

export const MACRO_NODE_TYPES: NodeType[] = ['site', 'concept', 'interpretation']
export const CONFIDENCE_LEVELS: Confidence[] = ['high', 'medium', 'low', 'speculative']

export interface FilterState {
  /** Node types currently visible. */
  types: Set<NodeType>
  /** Confidence tiers currently visible (applies to nodes and edges). */
  confidences: Set<Confidence>
  /** Quick switch: drop everything speculative. */
  hideSpeculative: boolean
  /** Focused concept id, or null. Focus highlights that concept's sites. */
  conceptFocus: string | null
  /** Evidence types visible; empty set = all. */
  evidenceTypes: Set<EvidenceType>
  /** Active year (negative = BCE), or null for the full range. */
  year: number | null
}

export function defaultFilters(): FilterState {
  return {
    types: new Set(MACRO_NODE_TYPES),
    confidences: new Set(CONFIDENCE_LEVELS),
    hideSpeculative: false,
    conceptFocus: null,
    evidenceTypes: new Set(),
    year: null,
  }
}

export interface VisibleGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
  /** Node ids dimmed by the time slider or concept focus (still drawn). */
  dimmed: Set<string>
}

function passesConfidence(c: Confidence, f: FilterState): boolean {
  if (f.hideSpeculative && c === 'speculative') return false
  return f.confidences.has(c)
}

export function computeVisible(filters: FilterState): VisibleGraph {
  const nodes = dataset.nodes.filter((n) => {
    if (!filters.types.has(n.type)) return false
    if (!passesConfidence(n.confidence, filters)) return false
    if (
      filters.evidenceTypes.size > 0 &&
      n.type === 'site' &&
      (!n.evidence_type || !filters.evidenceTypes.has(n.evidence_type))
    )
      return false
    return true
  })

  const visibleIds = new Set(nodes.map((n) => n.id))
  const edges = dataset.edges.filter(
    (e) =>
      visibleIds.has(e.source) &&
      visibleIds.has(e.target) &&
      passesConfidence(e.confidence, filters),
  )

  // Dimming: time slider (sites whose span misses the year) + concept focus
  // (sites not linked to the focused concept).
  const dimmed = new Set<string>()
  if (filters.year !== null) {
    for (const n of nodes) {
      if (n.type !== 'site') continue
      const active =
        n.date_start !== undefined &&
        n.date_end !== undefined &&
        filters.year >= n.date_start &&
        filters.year <= n.date_end
      if (!active) dimmed.add(n.id)
    }
  }
  if (filters.conceptFocus) {
    const linked = new Set<string>([filters.conceptFocus])
    for (const e of edges) {
      if (e.relation !== 'relates_to_concept') continue
      if (e.target === filters.conceptFocus) linked.add(e.source)
    }
    for (const n of nodes) {
      if (n.type === 'concept' && n.id !== filters.conceptFocus) dimmed.add(n.id)
      else if (!linked.has(n.id) && n.type === 'site') dimmed.add(n.id)
    }
  }

  return { nodes, edges, dimmed }
}

/** Neighbors of a node with the connecting edge, for the evidence panel. */
export function neighborsOf(id: string): { edge: GraphEdge; otherId: string }[] {
  return dataset.edges
    .filter((e) => e.source === id || e.target === id)
    .map((e) => ({ edge: e, otherId: e.source === id ? e.target : e.source }))
}

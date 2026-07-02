/**
 * Pure dataset serializers, shared by the in-browser export buttons and the
 * repo-level open-data build (scripts/export-data.mjs). Keeping these free
 * of browser APIs means the published files in data/ and the files a reader
 * downloads from the UI are byte-identical.
 */

import type { Dataset, GraphEdge, GraphNode } from '../types/schema'

export function csvCell(value: unknown): string {
  if (value === undefined || value === null) return ''
  const s = Array.isArray(value) ? value.join('; ') : String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export const NODE_COLUMNS: (keyof GraphNode)[] = [
  'id', 'type', 'label_en', 'label_tr', 'date_start', 'date_end', 'lat', 'lng',
  'modern_location', 'ancient_region', 'evidence_type', 'confidence',
  'sources', 'notes',
]

export const EDGE_COLUMNS: (keyof GraphEdge)[] = [
  'id', 'source', 'target', 'relation', 'label_en', 'label_tr', 'confidence',
  'sources', 'evidence_note',
]

export function nodesToCsv(dataset: Dataset): string {
  return [
    NODE_COLUMNS.join(','),
    ...dataset.nodes.map((n) => NODE_COLUMNS.map((c) => csvCell(n[c])).join(',')),
  ].join('\n')
}

export function edgesToCsv(dataset: Dataset): string {
  return [
    EDGE_COLUMNS.join(','),
    ...dataset.edges.map((e) => EDGE_COLUMNS.map((c) => csvCell(e[c])).join(',')),
  ].join('\n')
}

export function datasetToJson(dataset: Dataset): string {
  return JSON.stringify(dataset, null, 2)
}

/**
 * Open-data export: full dataset as JSON, nodes/edges as CSV (BRIEF §5).
 * Feeds Gephi (print-plate track) and the later Zenodo release.
 */

import type { GraphEdge, GraphNode } from '../types/schema'
import { dataset } from '../data/graph'

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportJson() {
  download(
    'anatolian-crossroads-macro.json',
    JSON.stringify(dataset, null, 2),
    'application/json',
  )
}

function csvCell(value: unknown): string {
  if (value === undefined || value === null) return ''
  const s = Array.isArray(value) ? value.join('; ') : String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const NODE_COLUMNS: (keyof GraphNode)[] = [
  'id', 'type', 'label_en', 'label_tr', 'date_start', 'date_end', 'lat', 'lng',
  'modern_location', 'ancient_region', 'evidence_type', 'confidence',
  'sources', 'notes',
]

const EDGE_COLUMNS: (keyof GraphEdge)[] = [
  'id', 'source', 'target', 'relation', 'label_en', 'label_tr', 'confidence',
  'sources', 'evidence_note',
]

export function exportCsv() {
  const nodeRows = [
    NODE_COLUMNS.join(','),
    ...dataset.nodes.map((n) => NODE_COLUMNS.map((c) => csvCell(n[c])).join(',')),
  ].join('\n')
  const edgeRows = [
    EDGE_COLUMNS.join(','),
    ...dataset.edges.map((e) => EDGE_COLUMNS.map((c) => csvCell(e[c])).join(',')),
  ].join('\n')
  download('anatolian-crossroads-nodes.csv', nodeRows, 'text/csv')
  download('anatolian-crossroads-edges.csv', edgeRows, 'text/csv')
}

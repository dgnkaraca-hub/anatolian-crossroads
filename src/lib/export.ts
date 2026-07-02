/**
 * Open-data export from the UI: full dataset as JSON, nodes/edges as CSV
 * (BRIEF §5). Serialization lives in serialize.ts so the repo's published
 * data/ files (scripts/export-data.mjs) are identical to these downloads.
 */

import { dataset } from '../data/graph'
import { datasetToJson, edgesToCsv, nodesToCsv } from './serialize'

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
  download('anatolian-crossroads-macro.json', datasetToJson(dataset), 'application/json')
}

export function exportCsv() {
  download('anatolian-crossroads-nodes.csv', nodesToCsv(dataset), 'text/csv')
  download('anatolian-crossroads-edges.csv', edgesToCsv(dataset), 'text/csv')
}

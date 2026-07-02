/**
 * Data-language toggle. UI chrome stays English-only (BRIEF §4 language rule);
 * only data fields (label/summary) switch between EN and TR.
 */

import type { GraphEdge, GraphNode } from '../types/schema'

export type DataLang = 'en' | 'tr'

export function nodeLabel(node: GraphNode, lang: DataLang): string {
  return lang === 'tr' ? node.label_tr : node.label_en
}

export function nodeSummary(node: GraphNode, lang: DataLang): string | undefined {
  return lang === 'tr' ? node.summary_tr : node.summary_en
}

export function edgeLabel(edge: GraphEdge, lang: DataLang): string | undefined {
  return lang === 'tr' ? (edge.label_tr ?? edge.label_en) : edge.label_en
}

/** Format a negative-year value for display, e.g. -9600 -> "9600 BCE". */
export function formatYear(year: number): string {
  return year < 0 ? `${-year} BCE` : `${year} CE`
}

export function formatSpan(start?: number, end?: number): string {
  if (start === undefined && end === undefined) return 'undated'
  if (start !== undefined && end !== undefined)
    return `c. ${-start}–${-end} BCE`
  return formatYear((start ?? end)!)
}

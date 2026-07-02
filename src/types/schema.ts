/**
 * Anatolian Crossroads — unified data schema (BRIEF §4).
 *
 * Non-negotiable disciplines:
 *  1. Every node and edge carries a non-empty `sources[]`. Un-sourced data is
 *     a bug; `validateGraph()` enforces this at runtime.
 *  2. Uncertainty is modelled, never flattened: `confidence` (including the
 *     `speculative` tier) + `notes`, and interpretive claims live in their own
 *     `interpretation` nodes — evidence and reading are never fused.
 *  3. No continuity claims. Cross-site edges are only `corridor`,
 *     `relates_to_concept` (via a concept node) or `compares_with`.
 *     A relation like `continues_into` must never exist in this schema.
 *  4. All code, identifiers and UI chrome are English-only; bilingualism lives
 *     exclusively in data fields (`label_tr`, `summary_tr`).
 *
 * Date convention: BCE as NEGATIVE years (9600 BCE === -9600), matching the
 * Sam'al and Göbekli Tepe modules.
 */

export type NodeType =
  | 'site'
  | 'structure'
  | 'object'
  | 'motif'
  | 'text'
  | 'actor'
  | 'deity'
  | 'concept'
  | 'interpretation'
  // legacy types kept for micro-module compatibility (Sam'al, Göbekli Tepe):
  | 'king'
  | 'official'
  | 'inscription'
  | 'language'
  | 'enclosure'
  | 'pillar'
  | 'phase'

export type Confidence = 'high' | 'medium' | 'low' | 'speculative'

export type EvidenceType =
  | 'pillar'
  | 'relief'
  | 'stele'
  | 'tablet'
  | 'seal'
  | 'wall_painting'
  | 'architecture'
  | 'inscription'

export interface GraphNode {
  /** Stable slug, e.g. "gobekli-tepe". */
  id: string
  type: NodeType
  label_en: string
  label_tr: string
  /** BCE as negative years (existing module convention wins). */
  date_start?: number
  date_end?: number
  /** REQUIRED for type "site" (map layer); validateGraph() enforces it. */
  lat?: number
  lng?: number
  modern_location?: string
  ancient_region?: string
  summary_en?: string
  summary_tr?: string
  /** Primary evidence class the site/record is known for. */
  evidence_type?: EvidenceType
  confidence: Confidence
  /** Bibliography keys (see dataset meta). NON-NEGOTIABLE: never empty. */
  sources: string[]
  source_urls?: string[]
  notes?: string
}

export type EdgeRelation =
  // macro level:
  | 'corridor'
  | 'relates_to_concept'
  | 'compares_with'
  | 'has_module'
  // micro level (existing projects, unchanged):
  | 'succeeded_by'
  | 'father_of'
  | 'commissioned'
  | 'written_in'
  | 'invokes'
  | 'mentions'
  | 'served'
  | 'contains'
  | 'central_pillar_of'
  | 'depicts'
  | 'dated_to'
  | 'co_occurs_with'
  | 'stratigraphically_above'
  | 'stylistically_related'
  // interpretation layer:
  | 'interpreted_as'
  | 'supported_by'
  | 'disputed_by'

/** Relations allowed between two `site` nodes at the macro level. */
export const MACRO_SITE_RELATIONS: ReadonlySet<EdgeRelation> = new Set([
  'corridor',
  'compares_with',
])

export interface GraphEdge {
  id: string
  source: string
  target: string
  relation: EdgeRelation
  label_en?: string
  label_tr?: string
  confidence: Confidence
  /** Same rule as nodes: never empty. */
  sources: string[]
  evidence_note?: string
}

export interface Dataset {
  nodes: GraphNode[]
  edges: GraphEdge[]
  meta: {
    title: string
    subtitle: string
    scope: string
    /** Bibliography keys referenced across the dataset, fully expanded. */
    bibliography: Record<string, string>
  }
}

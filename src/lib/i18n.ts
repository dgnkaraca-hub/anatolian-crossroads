/**
 * Bilingual layer. Data fields carry their own EN/TR text; UI chrome is
 * localized through the `ui()` dictionary below (keys are the English
 * strings, so EN mode is a pass-through). Curatorial free text (edge
 * evidence notes, node notes) resolves through translations.ts, keyed by
 * stable record ids — the dataset itself stays untouched.
 *
 * Dates: EN "9600 BCE" / "c. 9600–8200 BCE" · TR "MÖ 9600" / "y. MÖ 9600–8200".
 */

import type {
  Confidence,
  EdgeRelation,
  EvidenceType,
  GraphEdge,
  GraphNode,
  NodeType,
} from '../types/schema'
import { ANCIENT_REGION_TR, EDGE_NOTES_TR, NODE_NOTES_TR } from '../data/translations'

export type DataLang = 'en' | 'tr'

// ---------------------------------------------------------------------------
// UI chrome dictionary (EN string -> TR string)
// ---------------------------------------------------------------------------

const UI_TR: Record<string, string> = {
  // header
  'A Memory Graph from Neolithic Symbols to Iron Age Inscriptions · 9600–700 BCE':
    'Neolitik sembollerden Demir Çağı yazıtlarına uzanan Anadolu belleğinin görsel ağı · MÖ 9600–700',
  nodes: 'düğüm',
  edges: 'bağlantı',
  sources: 'kaynak',
  'records sourced': 'kayıt kaynaklandırıldı',
  // toolbar
  Types: 'Türler',
  Confidence: 'Güven düzeyi',
  'hide speculative': 'spekülatifleri gizle',
  Concept: 'Kavram',
  Evidence: 'Kanıt',
  'all concepts': 'tüm kavramlar',
  'all evidence': 'tüm kanıtlar',
  'export JSON': 'JSON dışa aktar',
  'export CSV': 'CSV dışa aktar',
  // time slider
  'full range': 'tüm aralık',
  'all periods': 'tüm dönemler',
  // story bar / panel
  'Story routes': 'Anlatı Rotaları',
  'Story route': 'Anlatı Rotası',
  exit: 'çık',
  '← prev': '← önceki',
  'next →': 'sonraki →',
  // listen panel
  listen: 'dinle',
  'Listen — sonification': 'Dinle — sonifikasyon',
  'Nine millennia,': 'Dokuz binyıl,',
  seconds: 'saniye',
  close: 'kapat',
  '▶ play': '▶ çal',
  '■ stop': '■ durdur',
  's sweep': 'sn. tarama',
  vol: 'ses',
  'Sonification: play the atlas as sound': 'Sonifikasyon: atlası ses olarak çal',
  step: 'adım',
  // panels
  'Site atlas': 'Yerleşim Atlası',
  'Macro network': 'Makro Ağ',
  'Sources': 'Kaynaklar',
  'Connections': 'Bağlantılar',
  'Module evidence': 'Modül kanıtı',
  'confidence:': 'güven düzeyi:',
  'primary evidence:': 'birincil kanıt:',
  'Open micro module:': 'Mikro modülü aç:',
  Corridors: 'Koridorlar',
  Comparisons: 'Karşılaştırmalar',
  Concepts: 'Kavramlar',
  Interpretations: 'Yorumlar',
  'Other connections': 'Diğer bağlantılar',
  undated: 'tarihsiz',
  // legend
  'compares with': 'karşılaştırma',
  'concept link': 'kavram bağı',
  records: 'kayıt',
  // map geo labels
  'Black Sea': 'Karadeniz',
  'Mediterranean Sea': 'Akdeniz',
  Euphrates: 'Fırat',
  Tigris: 'Dicle',
  'Micro modules:': 'Mikro modüller:',
}

/**
 * Localize a UI chrome string whose key IS the English text.
 * EN mode returns the key unchanged.
 */
export function ui(key: string, lang: DataLang): string {
  return lang === 'tr' ? (UI_TR[key] ?? key) : key
}

/** Longer UI passages, stored in both languages under a symbolic key. */
const UI_TEXT: Record<string, { en: string; tr: string }> = {
  listenFraming: {
    en: 'A deep listening of the atlas: each site sounds while it is attested. North is high, south is low; west is left, east is right; stone speaks in triangle waves, the written record in sine. Corridors ring once, when their later end awakens.',
    tr: 'Atlasın derin bir dinlemesi: her yerleşim, tanıklandığı sürece duyulur. Kuzey tizdir, güney pes; batı solda, doğu sağdadır; taş üçgen dalgayla, yazılı kayıt sinüsle konuşur. Koridorlar, geç uçları uyandığında bir kez çınlar.',
  },
  evidencePlaceholder: {
    en: 'Select a site, concept or interpretation to see its evidence trail: sources first, then dates, confidence and connections.',
    tr: 'Kanıt izini görmek için bir yerleşim, kavram ya da yorum seçin: önce kaynaklar, sonra tarihler, güven düzeyi ve bağlantılar.',
  },
  evidencePlaceholderSmall: {
    en: 'Cross-site meaning only travels through concept nodes — this atlas compares, it never claims continuity.',
    tr: 'Yerleşimler arası anlam yalnızca kavram düğümleri üzerinden taşınır — bu atlas karşılaştırır, asla süreklilik iddia etmez.',
  },
  sourcesModalIntro: {
    en: 'Every node and edge in this graph cites at least one of the entries below. Interpretive readings are separated into interpretation nodes and marked by confidence.',
    tr: 'Bu graftaki her düğüm ve bağlantı aşağıdaki girdilerden en az birine atıf yapar. Yorumsal okumalar ayrı yorum düğümlerinde tutulur ve güven düzeyiyle işaretlenir.',
  },
  footerMethod: {
    en: 'Comparative network — corridors, concepts and comparisons only; no continuity claims.',
    tr: 'Karşılaştırmalı ağ — yalnızca koridorlar, kavramlar ve karşılaştırmalar; süreklilik iddiası taşımaz.',
  },
}

export function uiText(key: keyof typeof UI_TEXT, lang: DataLang): string {
  return UI_TEXT[key][lang]
}

// ---------------------------------------------------------------------------
// Enumerated value labels
// ---------------------------------------------------------------------------

const TYPE_TR: Record<string, string> = {
  site: 'yerleşim',
  concept: 'kavram',
  interpretation: 'yorum',
}

export function typeLabel(type: NodeType, lang: DataLang): string {
  return lang === 'tr' ? (TYPE_TR[type] ?? type) : type
}

const CONF_TR: Record<Confidence, string> = {
  high: 'yüksek',
  medium: 'orta',
  low: 'düşük',
  speculative: 'spekülatif',
}

export function confLabel(c: Confidence, lang: DataLang): string {
  return lang === 'tr' ? CONF_TR[c] : c
}

const RELATION_TR: Partial<Record<EdgeRelation, string>> = {
  corridor: 'koridor',
  relates_to_concept: 'kavramla ilişkili',
  compares_with: 'karşılaştırma',
  interpreted_as: 'yorum ilişkisi',
  supported_by: 'destekleyen',
  disputed_by: 'itiraz eden',
}

export function relationLabel(rel: EdgeRelation, lang: DataLang): string {
  if (lang === 'tr') return RELATION_TR[rel] ?? rel.replace(/_/g, ' ')
  return rel.replace(/_/g, ' ')
}

const EVIDENCE_TR: Record<EvidenceType, string> = {
  pillar: 'dikilitaş',
  relief: 'kabartma',
  stele: 'stel',
  tablet: 'tablet',
  seal: 'mühür',
  wall_painting: 'duvar resmi',
  architecture: 'mimari',
  inscription: 'yazıt',
}

export function evidenceLabel(ev: EvidenceType, lang: DataLang): string {
  return lang === 'tr' ? EVIDENCE_TR[ev] : ev.replace('_', ' ')
}

// ---------------------------------------------------------------------------
// Data field accessors
// ---------------------------------------------------------------------------

export function nodeLabel(node: GraphNode, lang: DataLang): string {
  return lang === 'tr' ? node.label_tr : node.label_en
}

export function nodeSummary(node: GraphNode, lang: DataLang): string | undefined {
  return lang === 'tr' ? node.summary_tr : node.summary_en
}

export function nodeNotes(node: GraphNode, lang: DataLang): string | undefined {
  if (lang === 'tr') return NODE_NOTES_TR[node.id] ?? node.notes
  return node.notes
}

export function nodeRegion(node: GraphNode, lang: DataLang): string | undefined {
  if (lang === 'tr') return ANCIENT_REGION_TR[node.id] ?? node.ancient_region
  return node.ancient_region
}

export function edgeLabel(edge: GraphEdge, lang: DataLang): string | undefined {
  return lang === 'tr' ? (edge.label_tr ?? edge.label_en) : edge.label_en
}

export function edgeNote(edge: GraphEdge, lang: DataLang): string | undefined {
  if (lang === 'tr') return EDGE_NOTES_TR[edge.id] ?? edge.evidence_note
  return edge.evidence_note
}

// ---------------------------------------------------------------------------
// Dates (negative years = BCE)
// ---------------------------------------------------------------------------

export function formatYear(year: number, lang: DataLang = 'en'): string {
  if (year < 0) return lang === 'tr' ? `MÖ ${-year}` : `${-year} BCE`
  return lang === 'tr' ? `MS ${year}` : `${year} CE`
}

export function formatSpan(
  start: number | undefined,
  end: number | undefined,
  lang: DataLang = 'en',
): string {
  if (start === undefined && end === undefined) return ui('undated', lang)
  if (start !== undefined && end !== undefined)
    return lang === 'tr' ? `y. MÖ ${-start}–${-end}` : `c. ${-start}–${-end} BCE`
  return formatYear((start ?? end)!, lang)
}

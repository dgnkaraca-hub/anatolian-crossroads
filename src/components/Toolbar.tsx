/**
 * Filters + data-language toggle + export. Fully bilingual: the EN/TR
 * toggle switches both data fields and UI chrome (ui() dictionary).
 */

import type { Confidence, EvidenceType, NodeType } from '../types/schema'
import { dataset } from '../data/graph'
import {
  CONFIDENCE_LEVELS,
  MACRO_NODE_TYPES,
  type FilterState,
} from '../lib/filter'
import {
  confLabel,
  evidenceLabel,
  nodeLabel,
  typeLabel,
  ui,
  type DataLang,
} from '../lib/i18n'

interface Props {
  filters: FilterState
  setFilters: (f: FilterState) => void
  lang: DataLang
  setLang: (l: DataLang) => void
  onShowSources: () => void
  onExportJson: () => void
  onExportCsv: () => void
}

const EVIDENCE_TYPES: EvidenceType[] = [
  'pillar',
  'relief',
  'stele',
  'tablet',
  'seal',
  'wall_painting',
  'architecture',
  'inscription',
]

export default function Toolbar({
  filters,
  setFilters,
  lang,
  setLang,
  onShowSources,
  onExportJson,
  onExportCsv,
}: Props) {
  const concepts = dataset.nodes.filter((n) => n.type === 'concept')

  function toggleSet<T>(set: Set<T>, value: T): Set<T> {
    const next = new Set(set)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    return next
  }

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <span className="toolbar-label">{ui('Types', lang)}</span>
        {MACRO_NODE_TYPES.map((t: NodeType) => (
          <button
            key={t}
            className={`chip type-chip-${t}${filters.types.has(t) ? ' on' : ''}`}
            onClick={() =>
              setFilters({ ...filters, types: toggleSet(filters.types, t) })
            }
          >
            {typeLabel(t, lang)}
          </button>
        ))}
      </div>

      <div className="toolbar-group">
        <span className="toolbar-label">{ui('Confidence', lang)}</span>
        {CONFIDENCE_LEVELS.map((c: Confidence) => (
          <button
            key={c}
            className={`chip conf-chip-${c}${filters.confidences.has(c) ? ' on' : ''}`}
            onClick={() =>
              setFilters({
                ...filters,
                confidences: toggleSet(filters.confidences, c),
              })
            }
          >
            {confLabel(c, lang)}
          </button>
        ))}
        <label className="switch">
          <input
            type="checkbox"
            checked={filters.hideSpeculative}
            onChange={(e) =>
              setFilters({ ...filters, hideSpeculative: e.target.checked })
            }
          />
          {ui('hide speculative', lang)}
        </label>
      </div>

      <div className="toolbar-group">
        <span className="toolbar-label">{ui('Concept', lang)}</span>
        <select
          value={filters.conceptFocus ?? ''}
          onChange={(e) =>
            setFilters({ ...filters, conceptFocus: e.target.value || null })
          }
        >
          <option value="">{ui('all concepts', lang)}</option>
          {concepts.map((c) => (
            <option key={c.id} value={c.id}>
              {nodeLabel(c, lang)}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar-group">
        <span className="toolbar-label">{ui('Evidence', lang)}</span>
        <select
          value={filters.evidenceTypes.size === 1 ? [...filters.evidenceTypes][0] : ''}
          onChange={(e) =>
            setFilters({
              ...filters,
              evidenceTypes: e.target.value
                ? new Set([e.target.value as EvidenceType])
                : new Set(),
            })
          }
        >
          <option value="">{ui('all evidence', lang)}</option>
          {EVIDENCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {evidenceLabel(t, lang)}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar-group toolbar-right">
        <button
          className={`chip${lang === 'en' ? ' on' : ''}`}
          onClick={() => setLang('en')}
          title="Data language: English"
        >
          EN
        </button>
        <button
          className={`chip${lang === 'tr' ? ' on' : ''}`}
          onClick={() => setLang('tr')}
          title="Veri dili: Türkçe"
        >
          TR
        </button>
        <button className="chip" onClick={onShowSources}>
          {ui('Sources', lang).toLowerCase()}
        </button>
        <button className="chip" onClick={onExportJson}>
          {ui('export JSON', lang)}
        </button>
        <button className="chip" onClick={onExportCsv}>
          {ui('export CSV', lang)}
        </button>
      </div>
    </div>
  )
}

/**
 * Source-first evidence panel: the reader should always see WHY a record
 * exists before what it claims. Shows citations, confidence badge, dates,
 * connected records (grouped by relation class), module evidence from the
 * bridge layer, and the drill-down link when a micro module exists.
 * Fully bilingual, including curatorial notes (translations.ts).
 */

import { MODULES, dataset, getNode } from '../data/graph'
import { bridgeFor } from '../data/bridge'
import { neighborsOf } from '../lib/filter'
import type { EdgeRelation, GraphEdge } from '../types/schema'
import {
  confLabel,
  edgeLabel,
  edgeNote,
  evidenceLabel,
  formatSpan,
  nodeLabel,
  nodeNotes,
  nodeRegion,
  nodeSummary,
  relationLabel,
  typeLabel,
  ui,
  uiText,
  type DataLang,
} from '../lib/i18n'

interface Props {
  selectedId: string | null
  lang: DataLang
  onSelect: (id: string | null) => void
}

/** Connection groups, in reading order: geography, comparison, theme, reading. */
const CONNECTION_GROUPS: { title: string; relations: EdgeRelation[] }[] = [
  { title: 'Corridors', relations: ['corridor'] },
  { title: 'Comparisons', relations: ['compares_with'] },
  { title: 'Concepts', relations: ['relates_to_concept'] },
  { title: 'Interpretations', relations: ['interpreted_as', 'supported_by', 'disputed_by'] },
]

function groupOf(edge: GraphEdge): string {
  return (
    CONNECTION_GROUPS.find((g) => g.relations.includes(edge.relation))?.title ??
    'Other connections'
  )
}

export default function EvidencePanel({ selectedId, lang, onSelect }: Props) {
  const node = selectedId ? getNode(selectedId) : undefined

  if (!node) {
    return (
      <aside className="evidence-panel">
        <div className="panel-title">{ui('Evidence', lang)}</div>
        <p className="placeholder">{uiText('evidencePlaceholder', lang)}</p>
        <p className="placeholder small">{uiText('evidencePlaceholderSmall', lang)}</p>
      </aside>
    )
  }

  const module = MODULES[node.id]
  const neighbors = neighborsOf(node.id)
  const bridge = bridgeFor(node.id)

  return (
    <aside className="evidence-panel">
      <div className="panel-title">{ui('Evidence', lang)}</div>

      <div className={`node-type-tag type-${node.type}`}>
        {typeLabel(node.type, lang)}
      </div>
      <h2>{nodeLabel(node, lang)}</h2>
      <div className="meta-line">
        {formatSpan(node.date_start, node.date_end, lang)}
        {node.modern_location ? ` · ${node.modern_location}` : ''}
      </div>
      {nodeRegion(node, lang) && (
        <div className="meta-line faint">{nodeRegion(node, lang)}</div>
      )}

      <div className={`confidence-badge conf-${node.confidence}`}>
        {ui('confidence:', lang)} {confLabel(node.confidence, lang)}
      </div>
      {node.evidence_type && (
        <div className="meta-line">
          {ui('primary evidence:', lang)} {evidenceLabel(node.evidence_type, lang)}
        </div>
      )}

      <section className="sources-block">
        <h3>{ui('Sources', lang)}</h3>
        <ul>
          {node.sources.map((key) => (
            <li key={key}>
              <span className="source-key">{key}</span>
              <span className="source-full">
                {dataset.meta.bibliography[key] ?? 'MISSING FROM BIBLIOGRAPHY'}
              </span>
            </li>
          ))}
        </ul>
        {node.source_urls && node.source_urls.length > 0 && (
          <div className="source-urls">
            {node.source_urls.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {url}
              </a>
            ))}
          </div>
        )}
      </section>

      {nodeSummary(node, lang) && <p className="summary">{nodeSummary(node, lang)}</p>}
      {nodeNotes(node, lang) && <p className="notes">{nodeNotes(node, lang)}</p>}

      {module && (
        <a className="module-link" href={module.url} target="_blank" rel="noreferrer">
          {ui('Open micro module:', lang)}{' '}
          {lang === 'tr' ? module.label_tr : module.label} ↗
        </a>
      )}

      {bridge.length > 0 && (
        <section className="bridge-block">
          <h3>
            {ui('Module evidence', lang)} ({bridge.length})
          </h3>
          <ul>
            {bridge.map((b) => (
              <li key={`${b.module}:${b.record}:${b.macro}`}>
                <a
                  className="bridge-record"
                  href={MODULES[b.module].url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {lang === 'tr' ? b.label_tr : b.label_en} ↗
                </a>
                <span className="bridge-module-tag">
                  {lang === 'tr' ? MODULES[b.module].label_tr : MODULES[b.module].label}
                </span>
                <div className="edge-note">{lang === 'tr' ? b.note_tr : b.note_en}</div>
                <div className="edge-sources">
                  {b.sources.map((s) => (
                    <span key={s} className="source-key small">
                      {s}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="neighbors-block">
        <h3>
          {ui('Connections', lang)} ({neighbors.length})
        </h3>
        {[...CONNECTION_GROUPS.map((g) => g.title), 'Other connections'].map(
          (groupTitle) => {
            const members = neighbors.filter(({ edge }) => groupOf(edge) === groupTitle)
            if (members.length === 0) return null
            return (
              <div key={groupTitle} className="connection-group">
                <div className="connection-group-title">{ui(groupTitle, lang)}</div>
                <ul>
                  {members.map(({ edge, otherId }) => {
                    const other = getNode(otherId)
                    if (!other) return null
                    return (
                      <li key={edge.id}>
                        <button
                          className="neighbor-link"
                          onClick={() => onSelect(otherId)}
                        >
                          {nodeLabel(other, lang)}
                        </button>
                        <span className="relation-tag">
                          {relationLabel(edge.relation, lang)}
                        </span>
                        <span
                          className={`conf-dot conf-${edge.confidence}`}
                          title={confLabel(edge.confidence, lang)}
                        />
                        {edgeLabel(edge, lang) && (
                          <div className="edge-label">{edgeLabel(edge, lang)}</div>
                        )}
                        {edgeNote(edge, lang) && (
                          <div className="edge-note">{edgeNote(edge, lang)}</div>
                        )}
                        <div className="edge-sources">
                          {edge.sources.map((s) => (
                            <span key={s} className="source-key small">
                              {s}
                            </span>
                          ))}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          },
        )}
      </section>
    </aside>
  )
}

/**
 * Source-first evidence panel: the reader should always see WHY a record
 * exists before what it claims. Shows citations, confidence badge, dates,
 * connected records, and the drill-down link when a micro module exists.
 */

import { MODULES, dataset, getNode } from '../data/graph'
import { bridgeFor } from '../data/bridge'
import { neighborsOf } from '../lib/filter'
import type { EdgeRelation, GraphEdge } from '../types/schema'
import {
  edgeLabel,
  formatSpan,
  nodeLabel,
  nodeSummary,
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
        <div className="panel-title">Evidence</div>
        <p className="placeholder">
          Select a site, concept or interpretation to see its evidence trail:
          sources first, then dates, confidence and connections.
        </p>
        <p className="placeholder small">
          Cross-site meaning only travels through concept nodes — this atlas
          compares, it never claims continuity.
        </p>
      </aside>
    )
  }

  const module = MODULES[node.id]
  const neighbors = neighborsOf(node.id)
  const bridge = bridgeFor(node.id)

  return (
    <aside className="evidence-panel">
      <div className="panel-title">Evidence</div>

      <div className={`node-type-tag type-${node.type}`}>{node.type}</div>
      <h2>{nodeLabel(node, lang)}</h2>
      <div className="meta-line">
        {formatSpan(node.date_start, node.date_end)}
        {node.modern_location ? ` · ${node.modern_location}` : ''}
      </div>
      {node.ancient_region && (
        <div className="meta-line faint">{node.ancient_region}</div>
      )}

      <div className={`confidence-badge conf-${node.confidence}`}>
        confidence: {node.confidence}
      </div>
      {node.evidence_type && (
        <div className="meta-line">
          primary evidence: {node.evidence_type.replace('_', ' ')}
        </div>
      )}

      <section className="sources-block">
        <h3>Sources</h3>
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
      {node.notes && <p className="notes">{node.notes}</p>}

      {module && (
        <a className="module-link" href={module.url} target="_blank" rel="noreferrer">
          Open micro module: {module.label} ↗
        </a>
      )}

      {bridge.length > 0 && (
        <section className="bridge-block">
          <h3>Module evidence ({bridge.length})</h3>
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
                <span className="bridge-module-tag">{MODULES[b.module].label}</span>
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
        <h3>Connections ({neighbors.length})</h3>
        {[...CONNECTION_GROUPS.map((g) => g.title), 'Other connections'].map(
          (groupTitle) => {
            const members = neighbors.filter(({ edge }) => groupOf(edge) === groupTitle)
            if (members.length === 0) return null
            return (
              <div key={groupTitle} className="connection-group">
                <div className="connection-group-title">{groupTitle}</div>
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
                          {edge.relation.replace(/_/g, ' ')}
                        </span>
                        <span
                          className={`conf-dot conf-${edge.confidence}`}
                          title={edge.confidence}
                        />
                        {edgeLabel(edge, lang) && (
                          <div className="edge-label">{edgeLabel(edge, lang)}</div>
                        )}
                        {edge.evidence_note && (
                          <div className="edge-note">{edge.evidence_note}</div>
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

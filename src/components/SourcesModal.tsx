/**
 * Full bibliography of the macro dataset, with the count of records citing
 * each key. Mirrors sources.md in the repo.
 */

import { allSources, dataset } from '../data/graph'

interface Props {
  onClose: () => void
}

export default function SourcesModal({ onClose }: Props) {
  const usage = new Map<string, number>()
  for (const record of [...dataset.nodes, ...dataset.edges]) {
    for (const s of record.sources) usage.set(s, (usage.get(s) ?? 0) + 1)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Sources</h2>
          <button className="chip" onClick={onClose}>
            close
          </button>
        </div>
        <p className="modal-intro">
          Every node and edge in this graph cites at least one of the entries
          below. Interpretive readings are separated into interpretation nodes
          and marked by confidence.
        </p>
        <ul className="bibliography">
          {allSources().map((key) => (
            <li key={key}>
              <span className="source-key">{key}</span>
              <span className="usage-count">{usage.get(key) ?? 0} records</span>
              <div className="source-full">{dataset.meta.bibliography[key]}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

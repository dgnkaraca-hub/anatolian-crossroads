/**
 * Full bibliography of the macro dataset, with the count of records citing
 * each key. Mirrors sources.md in the repo. Bilingual chrome.
 */

import { allSources, dataset } from '../data/graph'
import { ui, uiText, type DataLang } from '../lib/i18n'

interface Props {
  lang: DataLang
  onClose: () => void
}

export default function SourcesModal({ lang, onClose }: Props) {
  const usage = new Map<string, number>()
  for (const record of [...dataset.nodes, ...dataset.edges]) {
    for (const s of record.sources) usage.set(s, (usage.get(s) ?? 0) + 1)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{ui('Sources', lang)}</h2>
          <button className="chip" onClick={onClose}>
            {ui('close', lang)}
          </button>
        </div>
        <p className="modal-intro">{uiText('sourcesModalIntro', lang)}</p>
        <ul className="bibliography">
          {allSources().map((key) => (
            <li key={key}>
              <span className="source-key">{key}</span>
              <span className="usage-count">
                {usage.get(key) ?? 0} {ui('records', lang)}
              </span>
              <div className="source-full">{dataset.meta.bibliography[key]}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

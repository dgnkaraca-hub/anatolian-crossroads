/**
 * Time slider over the full macro span, 9600 -> 700 BCE (negative years).
 * Null year = full range (no time dimming). Sites outside the active year
 * dim on both map and network rather than disappearing.
 */

import { formatYear, ui, type DataLang } from '../lib/i18n'

const MIN = -9600
const MAX = -700

interface Props {
  year: number | null
  lang: DataLang
  setYear: (y: number | null) => void
}

export default function TimeSlider({ year, lang, setYear }: Props) {
  return (
    <div className="time-slider">
      <button
        className={`chip${year === null ? ' on' : ''}`}
        onClick={() => setYear(null)}
      >
        {ui('full range', lang)}
      </button>
      <span className="time-min">{formatYear(MIN, lang)}</span>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={25}
        value={year ?? MIN}
        onChange={(e) => setYear(Number(e.target.value))}
      />
      <span className="time-max">{formatYear(MAX, lang)}</span>
      <span className="time-value">
        {year === null ? ui('all periods', lang) : formatYear(year, lang)}
      </span>
    </div>
  )
}

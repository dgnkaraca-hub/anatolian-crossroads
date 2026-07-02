/**
 * Time slider over the full macro span, 9600 -> 700 BCE (negative years).
 * Null year = full range (no time dimming). Sites outside the active year
 * dim on both map and network rather than disappearing.
 */

import { formatYear } from '../lib/i18n'

const MIN = -9600
const MAX = -700

interface Props {
  year: number | null
  setYear: (y: number | null) => void
}

export default function TimeSlider({ year, setYear }: Props) {
  return (
    <div className="time-slider">
      <button
        className={`chip${year === null ? ' on' : ''}`}
        onClick={() => setYear(null)}
      >
        full range
      </button>
      <span className="time-min">9600 BCE</span>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={25}
        value={year ?? MIN}
        onChange={(e) => setYear(Number(e.target.value))}
      />
      <span className="time-max">700 BCE</span>
      <span className="time-value">
        {year === null ? 'all periods' : formatYear(year)}
      </span>
    </div>
  )
}

/**
 * Listen mode (sonification, stretch goal S1). Playing sweeps the shared
 * time slider, so the map and network dim and light in sync with the sound.
 * The mapping legend is shown beside the controls — the ear should know
 * what it is hearing (docs/SONIFICATION.md).
 */

import { useEffect, useRef, useState } from 'react'
import { startSonification, type SonifyHandle } from '../lib/sonify'
import { ui, uiText, type DataLang } from '../lib/i18n'

interface Props {
  lang: DataLang
  onYear: (year: number | null) => void
  onClose: () => void
}

const DURATIONS = [60, 120, 300]

export default function ListenPanel({ lang, onYear, onClose }: Props) {
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(120)
  const [volume, setVolume] = useState(0.7)
  const handleRef = useRef<SonifyHandle | null>(null)

  useEffect(() => {
    return () => {
      handleRef.current?.stop()
    }
  }, [])

  function play() {
    handleRef.current?.stop()
    handleRef.current = startSonification({
      duration,
      volume,
      onYear: (y) => onYear(y),
      onEnd: () => setPlaying(false),
    })
    setPlaying(true)
  }

  function stop() {
    handleRef.current?.stop()
    handleRef.current = null
    setPlaying(false)
  }

  return (
    <div className="listen-panel">
      <div className="listen-header">
        <div>
          <div className="story-panel-kicker">{ui('Listen — sonification', lang)}</div>
          <h3>
            {ui('Nine millennia,', lang)} {duration} {ui('seconds', lang)}
          </h3>
        </div>
        <button
          className="chip"
          onClick={() => {
            stop()
            onClose()
          }}
        >
          {ui('close', lang)}
        </button>
      </div>

      <p className="listen-framing">{uiText('listenFraming', lang)}</p>

      <div className="listen-controls">
        <button className={`chip${playing ? '' : ' on'}`} onClick={playing ? stop : play}>
          {playing ? ui('■ stop', lang) : ui('▶ play', lang)}
        </button>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          disabled={playing}
        >
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              {d} {ui('s sweep', lang)}
            </option>
          ))}
        </select>
        <label className="listen-volume">
          {ui('vol', lang)}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            disabled={playing}
          />
        </label>
      </div>
    </div>
  )
}

/**
 * Listen mode (sonification, stretch goal S1). Playing sweeps the shared
 * time slider, so the map and network dim and light in sync with the sound.
 * The mapping legend is shown beside the controls — the ear should know
 * what it is hearing (docs/SONIFICATION.md).
 */

import { useEffect, useRef, useState } from 'react'
import { startSonification, type SonifyHandle } from '../lib/sonify'

interface Props {
  onYear: (year: number | null) => void
  onClose: () => void
}

const DURATIONS = [60, 120, 300]

export default function ListenPanel({ onYear, onClose }: Props) {
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
          <div className="story-panel-kicker">Listen — sonification</div>
          <h3>Nine millennia, {duration} seconds</h3>
        </div>
        <button
          className="chip"
          onClick={() => {
            stop()
            onClose()
          }}
        >
          close
        </button>
      </div>

      <p className="listen-framing">
        A deep listening of the atlas: each site sounds while it is attested.
        North is high, south is low; west is left, east is right; stone
        speaks in triangle waves, the written record in sine. Corridors ring
        once, when their later end awakens.
      </p>

      <div className="listen-controls">
        <button className={`chip${playing ? '' : ' on'}`} onClick={playing ? stop : play}>
          {playing ? '■ stop' : '▶ play'}
        </button>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          disabled={playing}
        >
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              {d} s sweep
            </option>
          ))}
        </select>
        <label className="listen-volume">
          vol
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

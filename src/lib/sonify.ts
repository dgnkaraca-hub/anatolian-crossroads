/**
 * Sonification engine (stretch goal S1): the macro atlas rendered as sound.
 *
 * A playhead sweeps 9600 -> 700 BCE over a chosen duration. Every site
 * sounds while its attestation window is active; geography is mapped to
 * the stereo field and register, evidence class to timbre. The mapping is
 * documented in docs/SONIFICATION.md and mirrors the visual encodings —
 * sonification here is a method, not an effect.
 *
 *   time     linear sweep, year(t) = MIN + (MAX-MIN) * t/D
 *   pitch    latitude 34.6..42.4°N -> 110..440 Hz (exponential) —
 *            "higher on the map, higher in register"
 *   pan      longitude 26..43.5°E -> stereo -0.85..+0.85 (west left)
 *   timbre   monumental evidence (pillar/relief/stele/wall painting/
 *            architecture) -> triangle; scribal evidence (tablet/seal/
 *            inscription) -> sine
 *   events   a corridor sounds once, when its later endpoint enters:
 *            a short dyad pluck between the two sites' registers
 *   dynamics fade-in/out over up to 200 years of the sweep; master
 *            low-pass + compressor keep the mix calm (deep listening)
 *
 * Sites without dates (none at macro level) would stay silent; filters do
 * not affect the sound — the ear always hears the full atlas.
 */

import type { GraphNode } from '../types/schema'
import { dataset } from '../data/graph'

export const SWEEP_MIN = -9600
export const SWEEP_MAX = -700

const LAT_MIN = 34.6
const LAT_MAX = 42.4
const LNG_MIN = 26.0
const LNG_MAX = 43.5

const FREQ_MIN = 110
const FREQ_MAX = 440

const MONUMENTAL = new Set(['pillar', 'relief', 'stele', 'wall_painting', 'architecture'])

export function siteFrequency(site: GraphNode): number {
  const t = ((site.lat ?? LAT_MIN) - LAT_MIN) / (LAT_MAX - LAT_MIN)
  return FREQ_MIN * Math.pow(FREQ_MAX / FREQ_MIN, Math.min(1, Math.max(0, t)))
}

export function sitePan(site: GraphNode): number {
  const t = ((site.lng ?? LNG_MIN) - LNG_MIN) / (LNG_MAX - LNG_MIN)
  return -0.85 + 1.7 * Math.min(1, Math.max(0, t))
}

export function siteWave(site: GraphNode): OscillatorType {
  return MONUMENTAL.has(site.evidence_type ?? '') ? 'triangle' : 'sine'
}

export interface SonifyHandle {
  stop: () => void
}

interface SonifyOptions {
  /** Sweep duration in seconds. */
  duration: number
  /** Master volume 0..1. */
  volume: number
  /** Called with the current (negative) year while playing. */
  onYear: (year: number) => void
  /** Called when the sweep completes or is stopped. */
  onEnd: () => void
}

/** Map a year to its position (seconds) on the sweep. */
function yearToTime(year: number, duration: number): number {
  return ((year - SWEEP_MIN) / (SWEEP_MAX - SWEEP_MIN)) * duration
}

export function startSonification(opts: SonifyOptions): SonifyHandle {
  const ctx = new AudioContext()
  // Autoplay policies may create the context suspended; resume explicitly.
  void ctx.resume()
  const t0 = ctx.currentTime + 0.1
  const D = opts.duration

  // Master chain: volume -> gentle low-pass -> compressor -> out.
  const master = ctx.createGain()
  master.gain.value = opts.volume
  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 2000
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -24
  comp.ratio.value = 4
  master.connect(lowpass).connect(comp).connect(ctx.destination)

  const sites = dataset.nodes.filter(
    (n) => n.type === 'site' && n.date_start !== undefined && n.date_end !== undefined,
  )
  const siteById = new Map(sites.map((s) => [s.id, s]))

  // One sustained voice per site, gain automated along its window.
  for (const site of sites) {
    const start = t0 + yearToTime(site.date_start!, D)
    const end = t0 + yearToTime(site.date_end!, D)
    const spanYears = site.date_end! - site.date_start!
    const rampYears = Math.min(200, spanYears / 4)
    const ramp = (rampYears / (SWEEP_MAX - SWEEP_MIN)) * D

    const osc = ctx.createOscillator()
    osc.type = siteWave(site)
    osc.frequency.value = siteFrequency(site)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t0)
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(0.11, start + ramp)
    gain.gain.setValueAtTime(0.11, Math.max(start + ramp, end - ramp))
    gain.gain.linearRampToValueAtTime(0, end)

    const pan = ctx.createStereoPanner()
    pan.pan.value = sitePan(site)

    osc.connect(gain).connect(pan).connect(master)
    osc.start(t0)
    osc.stop(t0 + D + 1)
  }

  // Corridor events: one soft dyad pluck when the later endpoint enters.
  for (const e of dataset.edges) {
    if (e.relation !== 'corridor') continue
    const a = siteById.get(e.source)
    const b = siteById.get(e.target)
    if (!a || !b) continue
    const year = Math.max(a.date_start!, b.date_start!)
    const overlaps = year <= Math.min(a.date_end!, b.date_end!)
    if (!overlaps) continue
    const at = t0 + yearToTime(year, D)
    for (const site of [a, b]) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = siteFrequency(site) * 2
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, at)
      gain.gain.linearRampToValueAtTime(0.08, at + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.6)
      const pan = ctx.createStereoPanner()
      pan.pan.value = sitePan(site)
      osc.connect(gain).connect(pan).connect(master)
      osc.start(at)
      osc.stop(at + 1.8)
    }
  }

  // Playhead: wall-clock + interval driven (the year step is 25 years, so
  // ~7 updates/second is ample), robust against rAF throttling and audio
  // autoplay blocking; the audio stays aligned to the context clock.
  const wall0 = performance.now() / 1000 + 0.1
  let stopped = false
  const timer = window.setInterval(() => {
    if (stopped) return
    const elapsed = performance.now() / 1000 - wall0
    if (elapsed >= D) {
      finish()
      return
    }
    if (elapsed >= 0) {
      const year = SWEEP_MIN + (SWEEP_MAX - SWEEP_MIN) * (elapsed / D)
      opts.onYear(Math.round(year / 25) * 25)
    }
  }, 150)

  function finish() {
    if (stopped) return
    stopped = true
    window.clearInterval(timer)
    void ctx.close()
    opts.onEnd()
  }

  return { stop: finish }
}

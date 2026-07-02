# Sonification — listening to the atlas (stretch goal S1)

The "listen" mode renders the macro graph as sound with the Web Audio API.
Like every other view in the project, it is an *encoding*, documented so the
listener knows what they are hearing. The framing is deep listening: slow
sustained tones over a 60–300 second sweep of nine millennia, meant to be
sat with rather than scanned.

## Mapping (mirrors the visual encodings)

| Data | Sound | Rationale |
|---|---|---|
| Sweep time | 9600 → 700 BCE, linear over the chosen duration | same axis as the time slider; playing drives the slider, so map and network dim/light in sync |
| Site attestation window | a sustained voice, fading in/out over ≤200 years of the sweep | a site "sounds while it is attested" |
| Latitude 34.6–42.4°N | pitch 110–440 Hz (exponential) | "higher on the map, higher in register" |
| Longitude 26–43.5°E | stereo pan −0.85…+0.85 | west on the left, east on the right |
| Evidence class | monumental (pillar/relief/stele/wall painting/architecture) → triangle wave; scribal (tablet/seal/inscription) → sine | stone vs. record as two timbres |
| Corridor edge | one soft dyad pluck (both sites' octaves) at the year its later endpoint enters | a route "rings" when both ends are alive |

Master chain: gain → 2 kHz low-pass → compressor. Filters in the toolbar do
NOT change the sound — the ear always hears the full atlas; only the eye is
filtered.

## What is deliberately not sonified

Concepts and interpretations (undated analytic layers), comparison edges
(scholarly acts, not events), and confidence (all macro sites are
high-confidence; a noise-based encoding would suggest data that is not
there). Story routes remain a visual/textual genre.

## Reuse

`src/lib/sonify.ts` is self-contained (dataset in, `SonifyHandle` out) and
exposes `siteFrequency` / `sitePan` / `siteWave` for reuse — e.g. a future
Kültepe-module sonification of caravan events, or an installation build for
exhibition (S2 print series + S1 sound as one room).

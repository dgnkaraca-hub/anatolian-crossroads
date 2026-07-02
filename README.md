# Anatolian Crossroads

**A Memory Graph from Neolithic Symbols to Iron Age Inscriptions**

Macro level of a two-level digital-humanities graph spanning 10 Anatolian /
Upper Mesopotamian sites, 9600–700 BCE. In this region memory is first
constructed through stone, body, animal and ritual imagery, and later
institutionalized through seals, tablets, inscriptions, palaces and urban
plans. The project models this as a **comparative network — it never claims
direct cultural continuity between sites.**

## Two-level architecture

- **Macro graph (this repo):** 10 `site` nodes joined only by geographic
  `corridor` edges and explicit `compares_with` pairs; all thematic meaning
  flows through 9 shared `concept` nodes (ritual, body, animal symbolism,
  writing, power, trade, memory, multilingualism, border kingdoms).
  Interpretive readings live in separate `interpretation` nodes.
- **Micro modules (sibling repos, untouched):**
  - Sam'al Epigraphic Network — port **5185**
  - Göbekli Tepe Network — port **5186**

## Views

Research dashboard: schematic **site atlas** (corridors + time slider
9600→700 BCE) coordinated with the **macro network** (d3-force) and a
source-first **evidence panel** (citations, confidence badges, connections
grouped by relation class, drill-down links to micro modules). Filters:
node type, confidence (with *hide speculative*), concept focus, evidence
type. Data language toggles EN/TR; UI chrome stays English. Full dataset
exports as JSON + CSV.

**Story routes** — four guided walkthroughs across the macro graph, defined
as sourced bilingual data in `src/data/stories.ts` (each step drives
selection, time slider and concept focus; `validateStories()` checks node
references, source keys and year ranges):

1. From Stone Symbols to Royal Inscriptions
2. The Rise of Written Memory
3. Euphrates Corridor of Power
4. Border Kingdoms and Multilingual Inscriptions

## Open data

The macro dataset is published in [`data/`](data/) (JSON + CSV + story
routes), regenerated from the TypeScript source of truth with
`npm run export-data` — the export refuses to run if validation fails.
Data is licensed **CC BY 4.0**, code **MIT**. Method note:
[`docs/METHOD.md`](docs/METHOD.md) — *Modelling uncertainty across
pre-literate and epigraphic networks*. Release/DOI steps:
[`docs/RELEASE.md`](docs/RELEASE.md); citation metadata in
[`CITATION.cff`](CITATION.cff) and [`.zenodo.json`](.zenodo.json).

## Stretch tracks

- **S1 · Sonification** — the "♫ listen" mode plays the atlas as sound
  (Web Audio): a 60–300 s sweep of 9600→700 BCE that drives the shared time
  slider; latitude → pitch, longitude → stereo, evidence class → timbre,
  corridors → dyad events. Mapping spec: [`docs/SONIFICATION.md`](docs/SONIFICATION.md).
- **S2 · Print series** — `npm run print-plates` renders three A3
  etching-style plates from the datasets ([`prints/`](prints/));
  `npm run export-gexf` writes Gephi-ready GEXF files (macro + Kültepe)
  into `data/` for hand-tuned exhibition layouts.

## Disciplines (non-negotiable)

1. Every node and edge carries non-empty `sources[]`; `validateGraph()`
   flags violations and the header shows the sourced-record count.
2. Uncertainty is modelled, never flattened: 4-tier `confidence`
   (high/medium/low/speculative) + interpretation nodes.
3. No continuity claims: site-to-site relations are restricted to
   `corridor` / `compares_with` at runtime.
4. English-only code and UI chrome; TR/EN bilingualism in data fields only.
5. Fixed dev port **5187** (`strictPort`); 5185/5186 belong to the modules.

## Development

```sh
npm install
npm run dev        # http://localhost:5187
npm run build      # tsc -b && vite build
```

See `docs/BRIEF.md` for the full project brief and `sources.md` for the
bibliography.

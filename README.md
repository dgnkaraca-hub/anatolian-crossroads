# Anatolian Crossroads

**A Memory Graph from Neolithic Symbols to Iron Age Inscriptions**

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21158715.svg)](https://doi.org/10.5281/zenodo.21158715)

**Live:** <https://dgnkaraca-hub.github.io/anatolian-crossroads/> — landing
page, macro atlas (`/atlas/`), and the three site modules (`/samal/`,
`/gobeklitepe/`, `/kultepe/`), with the open-data files under `/data/`.
**Repository:** <https://github.com/dgnkaraca-hub/anatolian-crossroads>

Anatolian Crossroads is a digital humanities memory graph that maps selected
Anatolian sites, concepts, symbols, inscriptions, and interpretive corridors
from the Neolithic to the Iron Age (9600–700 BCE). The project does not
claim direct cultural continuity; instead, it offers a comparative visual
framework for exploring spatial, symbolic, and textual relationships across
long historical duration.

> **TR** · Anatolian Crossroads, Neolitik dönemden Demir Çağı'na uzanan
> süreçte (MÖ 9600–700) Anadolu'daki seçili yerleşimleri, sembolleri,
> kavramları, yazıtları ve yorumlayıcı koridorları görselleştiren bir
> dijital beşeri bilimler bellek grafıdır. Proje doğrudan kültürel
> süreklilik iddiası taşımaz; uzun tarihsel süre içinde mekânsal, sembolik
> ve metinsel ilişkileri karşılaştırmalı biçimde keşfetmeye yönelik bir
> çerçeve sunar.

## Research scope and data model

- **Time range:** 9600–700 BCE (BCE stored as negative years).
- **Records:** `site`, `concept` and `interpretation` nodes; `corridor`,
  `compares_with`, `relates_to_concept` and interpretation-layer edges —
  every node and edge carries `sources[]` and a four-tier `confidence`
  value (`high`/`medium`/`low`/`speculative`).
- **Methodological warning:** this is a *comparative* network. Cross-site
  relations are restricted to geographic corridors, explicit comparative
  pairs and shared concepts; a relation such as `continues_into` cannot
  exist in the schema and the runtime validator rejects site-to-site edges
  outside the permitted set.

## Two-level architecture

- **Macro graph (this repo):** 10 `site` nodes joined only by geographic
  `corridor` edges and explicit `compares_with` pairs; all thematic meaning
  flows through 9 shared `concept` nodes (ritual, body, animal symbolism,
  writing, power, trade, memory, multilingualism, border kingdoms).
  Interpretive readings live in separate `interpretation` nodes.
- **Micro modules (sibling repos, untouched):**
  - Sam'al Epigraphic Network — port **5185**
  - Göbekli Tepe Network — port **5186**
  - Kültepe-Kaneš (Pūšu-kēn family network) — port **5191**
- **Bridge layer** (`src/data/bridge.ts`) — the machine-readable link
  between the levels: curated, sourced mappings from macro concepts and
  module sites to REAL records inside the modules (e.g. *memory* →
  Katumuwa stele · Enclosure D · Pūšu-kēn archive). Shown as "Module
  evidence" in the evidence panel; exported as
  `data/anatolian-crossroads-combined.gexf`. Record ids are verified
  against the sibling datasets with `npm run check-bridge`. Module
  evidence attaches only to concepts and its own site — the
  no-continuity rule holds across levels.

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
4. English-only code and identifiers; the interface itself is fully
   bilingual — the EN/TR toggle switches both UI chrome and data fields
   (dates render as "9600 BCE" / "MÖ 9600").
5. Fixed dev port **5187** (`strictPort`); 5185/5186 belong to the modules.

## Archive and citation (Zenodo)

The v1.0.0 macro dataset is archived on Zenodo with a DOI:
concept DOI **[10.5281/zenodo.21158715](https://doi.org/10.5281/zenodo.21158715)**
(always resolves to the latest version; v1.0.0 specifically is
`10.5281/zenodo.21158716`). Data files are CC BY 4.0; code is MIT.
Citation metadata lives in [`CITATION.cff`](CITATION.cff) (GitHub's
"Cite this repository" box) and [`.zenodo.json`](.zenodo.json).

Suggested citation:

> Karaca, D. (2026). *Anatolian Crossroads: A Memory Graph from Neolithic
> Symbols to Iron Age Inscriptions (macro dataset)*, v1.0.0. Zenodo.
> <https://doi.org/10.5281/zenodo.21158715>

## Development

```sh
npm install
npm run dev        # http://localhost:5187
npm run build      # tsc -b && vite build
```

See `docs/BRIEF.md` for the full project brief and `sources.md` for the
bibliography.

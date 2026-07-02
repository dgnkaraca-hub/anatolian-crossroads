# BRIEF — Anatolian Crossroads (v1 skeleton)

**A Memory Graph from Neolithic Symbols to Iron Age Inscriptions**
Unified project brief · Prepared 2 July 2026 · Supersedes and absorbs: `Anatolian_Memory_Graph_Handoff_Dogan_Karaca.md`
Project name: **Anatolian Crossroads** (umbrella brand); "Memory Graph" is retained as the subtitle/thesis line.

> Core thesis: in Anatolia and Upper Mesopotamia, memory is first constructed
> through stone, body, animal and ritual imagery; it is later institutionalized
> through seals, tablets, inscriptions, palaces and urban plans.
> **The project models this as a comparative network — it never claims direct
> cultural continuity between sites.**

---

## 1. What already exists (do not rebuild)

| Module | Repo/dir | Port | Status |
|---|---|---|---|
| Sam'al Epigraphic Network | `/Users/yontem/Desktop/dgn-karaca/samal-network` | **5185** | Complete through build step 7; deploy pending |
| Göbekli Tepe Network | `/Users/yontem/Desktop/dgn-karaca/gobeklitepe-network` | **5186** | 27 nodes / 30 edges, all sourced; deploy pending |

Environment: **Mac**. GitHub username `dgn-karaca`. A `GITHUB_TOKEN` exists in
project `.env` files — read-only access is permitted for configuration lookup;
never print, echo, log or expose its value; never edit `.env` without explicit
permission. Before starting any dev server, check whether the project is
already running on its dedicated port (`lsof -i :PORT`) and reuse it.

Both existing modules stay intact as the first two **micro graphs** of the
umbrella project (see §2). Their schemas are not thrown away; they are mapped
into the unified schema via a migration layer (§4).

## 2. Architecture decision: two-level graph

The single most important decision in v1. It resolves the scope problem
(10 sites × deep sourced data = months) without sacrificing the vision.

**Level 1 — Macro graph ("the atlas"):**
All 10 sites exist only as `site` nodes, connected by:
- `corridor` edges (geographic corridors from the handoff §3),
- `concept` edges (both sites relate to a shared concept node),
- `compares_with` edges (explicit comparative pairs, never `continues_into`).
Cheap to curate: ~10 site nodes + ~9 concept nodes + ~30–40 edges, all sourced
from the institutional list (UNESCO, Antiquity, Chicago/Zincirli, Taş Tepeler).

**Level 2 — Micro graphs ("the modules"):**
Deep, fully sourced per-site subgraphs. v1 ships with two (Sam'al, Göbekli
Tepe). New modules open one at a time. Clicking a `site` node in the macro
graph that has a module drills into it.

**Cross-site linking rule:** sites never link to each other directly at the
evidence level. They link through `concept` nodes (ritual, body, animal
symbolism, writing, power, trade, memory, multilingualism, border kingdoms).
This is the methodological safeguard against implied continuity.

## 3. Site roster (macro level)

Chronological backbone, as in the handoff:

1. Göbekli Tepe — c. 9600–8200 BCE — pre-literate monumental ritual *(module exists)*
2. Karahantepe / Taş Tepeler — c. 9500 BCE onward — regional Neolithic symbol network
3. Sayburç — 9th millennium BCE — early narrative scene
4. Çatalhöyük — c. 7400–5200 BCE — household and community memory
5. Arslantepe — c. 4300–3900 BCE + 4th mill. — sealing, storage, early administration
6. Kültepe-Kaneš — c. 1950–1750 BCE — textual/commercial network archive
7. Hattuşa / Yazılıkaya — 17th–12th c. BCE — imperial writing, ritual, urban plan
8. Karkamış — 12th–8th c. BCE — Euphrates crossing, Luwian hieroglyphs
9. Sam'al / Zincirli — c. 920–713 BCE — border kingdom epigraphy *(module exists)*
10. Karatepe-Aslantaş — 8th–7th c. BCE — bilingual inscription, border fortress

Recommended third micro-graph module: **Kültepe-Kaneš** — it is textual,
prosopographic and ideal for social-network analysis, and it embodies the
project's pivot point ("the rise of written memory"). Scope it to ONE
published merchant-family network (a curated sample, not the 23,500-tablet
corpus).

## 4. Unified data schema (superset)

Fixes relative to the source handoff: adds coordinates, defines the
`interpretation` node type, standardizes the date convention, and separates
data bilingualism from UI language.

```ts
type NodeType =
  | "site" | "structure" | "object" | "motif" | "text"
  | "actor" | "deity" | "concept" | "interpretation"
  // legacy types kept for module compatibility:
  | "king" | "official" | "inscription" | "language"
  | "enclosure" | "pillar" | "phase";

type Confidence = "high" | "medium" | "low" | "speculative";

interface GraphNode {
  id: string;                 // stable slug
  type: NodeType;
  label_en: string;
  label_tr: string;
  date_start?: number;        // BCE as NEGATIVE years (existing convention wins)
  date_end?: number;
  lat?: number;               // REQUIRED for type "site" (map layer)
  lng?: number;
  modern_location?: string;
  ancient_region?: string;
  summary_en?: string;
  summary_tr?: string;
  evidence_type?: "pillar" | "relief" | "stele" | "tablet" | "seal"
                | "wall_painting" | "architecture" | "inscription";
  confidence: Confidence;
  sources: string[];          // NON-NEGOTIABLE: empty sources[] is a bug
  source_urls?: string[];
  notes?: string;
}

type EdgeRelation =
  // macro level:
  | "corridor" | "relates_to_concept" | "compares_with" | "has_module"
  // micro level (existing projects, unchanged):
  | "succeeded_by" | "father_of" | "commissioned" | "written_in"
  | "invokes" | "mentions" | "served"
  | "contains" | "central_pillar_of" | "depicts" | "dated_to"
  | "co_occurs_with" | "stratigraphically_above" | "stylistically_related"
  // interpretation layer:
  | "interpreted_as" | "supported_by" | "disputed_by";

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: EdgeRelation;
  label_en?: string;
  label_tr?: string;
  confidence: Confidence;
  sources: string[];          // same rule: never empty
  evidence_note?: string;
}
```

**Interpretation nodes:** every interpretive claim ("T-pillars are
anthropomorphic beings", "Kuttamuwa stele implies soul-in-stone belief") lives
as its own `interpretation` node linked via `interpreted_as` /
`supported_by` / `disputed_by`. Evidence and reading are never fused in one
record. Anything the sources do not state is marked `speculative`.

**Date convention:** BCE as negative numbers everywhere (matches the two
existing modules). The handoff's `date_start_bce` positive convention is
dropped.

**Language rule:** ALL code, comments, identifiers, commit messages and UI
chrome are English-only. Bilingualism lives exclusively in data fields
(`label_tr`, `summary_tr`) and a TR/EN content toggle.

## 5. Interface plan

Research dashboard, not a decorative timeline:

- **Three coordinated views:** map (site nodes, corridor lines, time slider
  9600→700 BCE) · network graph (macro, drill-down to modules) · evidence
  panel (source-first: sigla, editions, URLs, confidence badge).
- **Filters:** concept layer · evidence type · confidence (with a
  "hide speculative" switch).
- **Story routes** (guided walkthroughs across the macro graph):
  1. From Stone Symbols to Royal Inscriptions
  2. The Rise of Written Memory
  3. Euphrates Corridor of Power
  4. Border Kingdoms and Multilingual Inscriptions
- **Export:** JSON + CSV of the full dataset from the UI (feeds Third Brain
  OS / Living Archive later, and Gephi for the print-plate art track).
- Visual language: continuation of the existing modules — dark
  excavation-section ground, single ochre accent, restrained serif labels.
  No generic cream/terracotta defaults.

## 6. Phased roadmap

| Phase | Deliverable | Effort |
|---|---|---|
| 0 | Deploy existing two modules (Netlify) under one landing page + shared domain | days |
| 1 | Macro graph: 10 site nodes + 9 concept nodes + corridor/concept edges, all sourced; new repo `anatolian-crossroads`, port **5187** | 1–2 weeks |
| 2 | Map view + timeline slider (GeoJSON, site coordinates) | 1 week |
| 3 | Drill-down integration: macro → Sam'al / Göbekli Tepe modules | 1 week |
| 4 | Story routes + evidence panel polish | 1 week |
| 5 | Open data release: JSON/CSV on GitHub + Zenodo DOI + short method note ("Modelling uncertainty across pre-literate and epigraphic networks") | 1 week |
| 6 | Kültepe-Kaneš micro module (one merchant-family network, curated sample) | 2–3 weeks |
| S1 | Sonification prototype (Web Audio; network → sound, deep-listening framing) | stretch |
| S2 | Gephi → etching-style print series (exhibition/portfolio track) | stretch |

Phases 0–4 make the project "finished and public"; 5–6 and the stretch items
turn it into scholarly and artistic value. Phase 5 doubles as the Veri Analizi
Okulu capstone deliverable and conference/grant material (ANAMED,
CultureCIVIC).

## 7. Non-negotiable disciplines (inherited + extended)

1. Every node and edge carries `sources[]`; `validateGraph()` flags
   violations at runtime and the header shows the sourced-record count.
2. Uncertainty is modelled, never flattened: `confidence` + `notes`,
   plus the new `speculative` tier and interpretation nodes.
3. **No continuity claims.** Cross-site edges are only `corridor`,
   `relates_to_concept`, or `compares_with`. A relation like
   `continues_into` must never exist in the schema.
4. English-only code and UI chrome; TR/EN bilingualism in data only.
5. Ports are fixed and separate: 5185 Sam'al · 5186 Göbekli Tepe ·
   5187 macro graph. Check before launching.
6. Never print or log secret values from `.env`.

## 8. Claude Code handoff prompt (paste as-is on Mac)

```text
PROJECT HANDOFF — Anatolian Crossroads (macro level, Phase 1)

Read docs/BRIEF.md first (this document). Environment: Mac,
/Users/yontem/Desktop/dgn-karaca/anatolian-crossroads, GitHub user
dgn-karaca, dev server fixed at port 5187 (check `lsof -i :5187` first;
reuse if running). Never print or log the GITHUB_TOKEN from any .env.

Goal: the macro level of a two-level digital-humanities graph spanning
10 Anatolian/Upper Mesopotamian sites (9600–700 BCE). Sibling modules
samal-network (:5185) and gobeklitepe-network (:5186) already exist and
must not be modified; this project will later drill into them.

Stack: Vite + React + TypeScript + D3 (d3-force, d3-geo, d3-scale,
d3-zoom). Fully client-side. No backend.

Build order:
1. Scaffold with the unified schema from BRIEF §4 (types/schema.ts) and
   validateGraph() enforcing non-empty sources[] on every record.
2. Seed data: 10 site nodes (with lat/lng), 9 concept nodes, corridor +
   concept + compares_with edges — every record sourced from BRIEF §3's
   institutional source list. Confidence honest; interpretive links are
   "speculative" unless a source states them.
3. Map view with time slider (BCE as negative years, 9600→700).
4. Macro network view coordinated with the map.
5. Evidence panel (source-first) + concept/evidence/confidence filters.

Disciplines: no continuity-claim relations; English-only code and UI
chrome; TR/EN only in data fields. Confirm each step builds (tsc + vite)
before moving on.

[CURRENT STATUS]: fresh start — execute step 1.
```

## 9. Source list (inherited from the handoff)

UNESCO WHC (Göbekli Tepe 1572, Çatalhöyük 1405, Arslantepe 1622, Hattusha 377,
Kültepe tentative 5905) · UNESCO Memory of the World (Old Assyrian archives) ·
Taş Tepeler Project (Karahantepe, Sayburç) · Antiquity (Sayburç reliefs) ·
Hittite Monuments (Karkamış) · Chicago-Tübingen Zincirli Expedition · ISAC
(Kuttamuwa) · USC WSRP (Kilamuwa) · muze.gov.tr (Karatepe-Aslantaş).
Full URLs preserved in the source handoff document; copy them into
`sources.md` in the repo during Phase 1.

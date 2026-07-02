# Modelling uncertainty across pre-literate and epigraphic networks

**Method note for the Anatolian Crossroads macro dataset (v1.0.0)**
Doğan Karaca · 2 July 2026

## 1. Aim and scope

Anatolian Crossroads models how memory was constructed and institutionalized
across ten sites in Anatolia and Upper Mesopotamia between roughly 9600 and
700 BCE — from the pre-literate monumental enclosures of Göbekli Tepe to the
bilingual royal inscriptions of Karatepe-Aslantaş. The dataset released here
is the **macro level** of a two-level architecture: sites, shared concepts,
geographic corridors, explicit comparative pairs, and a separate layer of
interpretive claims. Deep per-site evidence lives in independent **micro
modules** (currently Sam'al/Zincirli and Göbekli Tepe) with their own
datasets; the macro graph references but does not duplicate them.

The central methodological problem is that the network spans two regimes of
evidence that are usually kept apart: pre-literate material symbolism (where
every "meaning" is a modern reading) and epigraphic corpora (where texts
speak, but selectively and rhetorically). A single flat graph would silently
launder interpretation into fact. The design decisions below are all
responses to that problem.

## 2. No continuity claims

The best-known failure mode of long-span comparative projects is the implied
lineage: arrows from Göbekli Tepe to Hattuşa that a reader inevitably takes
as "A led to B". This dataset makes such claims **structurally impossible**:

- Two `site` nodes may only be connected by `corridor` (a geographic route,
  e.g. the Euphrates axis) or `compares_with` (an explicit comparative pair
  attested in scholarship).
- All thematic connection travels through nine shared `concept` nodes
  (ritual, body, animal symbolism, writing, power, trade, memory,
  multilingualism, border kingdoms). Sites relate to concepts; concepts never
  assert relations between sites.
- A relation such as `continues_into` does not exist in the schema, and the
  runtime validator (`validateGraph()`) rejects any site-to-site edge outside
  the two permitted relations. The constraint is enforced in code, not by
  editorial discipline alone.

## 3. Sourcing discipline

Every node and every edge carries a non-empty `sources[]` array of
bibliography keys (expanded in `sources.md` and in the dataset's `meta`
block). An un-sourced record is treated as a bug: the validator flags it and
the application header reports the sourced-record count (79/79 in v1.0.0).
The source base is deliberately institutional — UNESCO World Heritage
statements, the Taş Tepeler programme, the Chicago-Tübingen Zincirli
expedition, the primary publication of the Sayburç relief — so that each
record can be checked against a stable public reference.

Concept nodes are a special case: they are **analytic categories of this
project**, not archaeological claims. Each cites the project brief as its
defining source plus at least one institutional anchor where the category is
applied, and carries a note stating its analytic status.

## 4. Uncertainty: four tiers plus an interpretation layer

Confidence is modelled on every record with four tiers: `high`, `medium`,
`low`, `speculative`. Two rules govern their use:

1. **Interpretive links are `speculative` unless a source states them.**
   Example: extending the "T-pillars as anthropomorphic beings" reading from
   Göbekli Tepe (where Schmidt argues it) to Karahantepe (where the cited
   publication does not) drops the edge from `medium` to `speculative`.
2. **Evidence and reading are never fused in one record.** Every interpretive
   claim is its own `interpretation` node (e.g. "Kuttamuwa stele implies a
   soul dwelling in the stone"), linked to sites via `interpreted_as` /
   `supported_by` / `disputed_by`. Deleting the interpretation layer leaves a
   purely documentary graph; the readings are additive, inspectable and
   individually refutable.

The interface treats uncertainty as a first-class filter: readers can hide
speculative records entirely, or filter by tier — the graph degrades
gracefully to its best-attested core.

## 5. Temporal model

Dates are integers using the astronomical convention: BCE years are negative
(9600 BCE = -9600). This keeps chronological ordering and linear scales
correct without era special-casing, and matches the two micro modules. Site
date ranges follow the cited institutional statements; where a site has
phases outside the macro window (e.g. Arslantepe's later Neo-Hittite levels),
the modelled window is stated in `notes` rather than silently truncated.
The time slider dims rather than removes out-of-range sites: temporal
filtering is a lens, not an eraser.

## 6. Bilingual data, monolingual structure

All identifiers, code and UI chrome are English; every human-readable data
field is bilingual (`label_en`/`label_tr`, `summary_en`/`summary_tr`,
narrative fields in story routes). Language is data, not infrastructure —
the TR/EN toggle changes content only, which keeps the schema stable for
reuse in either language community.

## 7. Story routes as sourced data

The four guided walkthroughs are published in `stories.json`. Each step
focuses one existing node, optionally sets the time filter and concept
filter, and carries its own `sources[]`. A dedicated validator
(`validateStories()`) checks node references, bibliography keys and year
ranges, so narrative can never drift away from the underlying records.

## 8. Limitations

- Macro-level coordinates for Sayburç, Karahantepe and Kültepe are
  approximate (noted per record); the basemap is schematic, not cartographic.
- The comparative pairs are a curated minimum, not a survey of the
  comparative literature.
- Concept assignment is binary (a site relates to a concept or not);
  strength of association is not modelled in v1.
- The corpus is 10 sites; absences (e.g. Norşuntepe, Alaca Höyük, Tell
  Tayinat) reflect scope, not judgement.

## 9. Files, licensing, citation

The release contains `anatolian-crossroads-macro.json` (full dataset with
bibliography), `nodes.csv` / `edges.csv` (flat tables, `; `-joined list
fields), and `stories.json`. Data files are released under **CC BY 4.0**;
the application code under **MIT** (see `LICENSE` and `data/README.md`).
Cite via the repository's `CITATION.cff` or the Zenodo DOI once minted
(see `docs/RELEASE.md`).

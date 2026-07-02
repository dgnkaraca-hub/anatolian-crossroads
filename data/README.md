# Anatolian Crossroads — open data (macro level, v1.0.0)

Machine-readable release of the macro graph: 10 sites (9600–700 BCE),
9 concepts, 3 interpretation nodes, 57 edges — every record sourced, with a
four-tier confidence model and no cultural-continuity relations. Method note:
[`docs/METHOD.md`](../docs/METHOD.md). Bibliography: [`sources.md`](../sources.md).

**These files are generated — do not edit them by hand.** The source of
truth is `src/data/graph.ts` / `src/data/stories.ts`; regenerate with
`npm run export-data` (the export refuses to run if the dataset fails
validation).

## Files

| File | Contents |
|---|---|
| `anatolian-crossroads-macro.json` | Full dataset: nodes, edges, metadata and expanded bibliography |
| `nodes.csv` | Flat node table (list fields joined with `; `) |
| `edges.csv` | Flat edge table |
| `stories.json` | Four bilingual (EN/TR) story routes as sourced step data |

## Conventions

- BCE dates are negative integers (9600 BCE = `-9600`).
- `sources` values are bibliography keys, expanded in the JSON `meta.bibliography`
  block and in `sources.md`.
- `confidence` ∈ `high` | `medium` | `low` | `speculative`.
- Site-to-site edges are only `corridor` or `compares_with`; thematic links
  run through `concept` nodes; readings live in `interpretation` nodes.

## License and citation

The data files in this directory are released under
[Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
The application code is MIT-licensed (see [`LICENSE`](../LICENSE)).

Cite via [`CITATION.cff`](../CITATION.cff), or the Zenodo DOI once minted:

> Karaca, D. (2026). *Anatolian Crossroads: A Memory Graph from Neolithic
> Symbols to Iron Age Inscriptions (macro dataset)*, v1.0.0.

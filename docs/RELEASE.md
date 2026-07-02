# Release checklist — open data (Phase 5)

Steps to publish v1.0.0 with a Zenodo DOI. Local prerequisites are already
in the repo: `data/` package, `docs/METHOD.md`, `CITATION.cff`, `.zenodo.json`,
split licensing (MIT code / CC BY 4.0 data).

## 1. Regenerate and verify the data package

```sh
npm run export-data   # refuses to export if validation fails
npm run build         # tsc + vite must pass
git status            # data/ diff should be intentional
```

## 2. Push to GitHub

```sh
git remote add origin git@github.com:dgnkaraca-hub/anatolian-crossroads.git
git push -u origin main
```

The repository must be **public** for Zenodo integration and for the DOI
badge to resolve for readers.

## 3. Link GitHub → Zenodo (once)

1. Sign in at <https://zenodo.org> with the GitHub account (`dgnkaraca-hub`).
2. Zenodo → account menu → **GitHub** → flip the toggle ON for
   `dgnkaraca-hub/anatolian-crossroads`.
3. Zenodo reads `.zenodo.json` from the repo at release time — title,
   creators, `upload_type: dataset`, CC BY 4.0 license and keywords are
   already set there.

## 4. Cut the release

```sh
git tag -a v1.0.0 -m "Open data release: macro dataset v1.0.0"
git push origin v1.0.0
```

Then GitHub → Releases → **Draft a new release** → choose tag `v1.0.0`,
title `v1.0.0 — macro dataset`, describe the data package briefly, publish.
Zenodo archives the release automatically and mints a DOI within minutes.

## 5. After the DOI exists

1. Copy the **concept DOI** (version-independent) from the Zenodo record.
2. Add the DOI badge to `README.md` and the recommended-citation line in
   `data/README.md`.
3. Add a `doi` field to `CITATION.cff` (`doi: 10.5281/zenodo.XXXXXXX`).
4. Commit as `Add Zenodo DOI` — no new release needed.

## 6. Announce / reuse

- Veri Analizi Okulu capstone submission: repo URL + DOI + `docs/METHOD.md`.
- Grant/conference material (ANAMED, CultureCIVIC): cite the DOI, attach the
  method note.
- The JSON/CSV files load directly in Gephi (edges.csv as an edge list) for
  the print-plate art track.

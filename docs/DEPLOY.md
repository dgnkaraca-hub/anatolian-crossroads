# Deploy — one landing page, one domain (Phase 0)

The whole project ships as a single static site assembled from four builds:

| Path | App | Source repo/dir |
|---|---|---|
| `/` | Landing page | `landing/index.html` (this repo) |
| `/atlas/` | Macro graph | this repo |
| `/samal/` | Sam'al Epigraphic Network | `../samal_digital_humanities` |
| `/gobeklitepe/` | Göbekli Tepe Network | `../gobeklitepe_digital_humanities` |
| `/kultepe/` | Pūšu-kēn Family Network | `../kultepe_digital_humanities` |
| `/data/` | Open-data files (JSON/CSV) | `data/` (this repo) |

## Build

```sh
npm run assemble-site   # builds all four apps, composes site/
```

Requires the three sibling module directories next to this repo (all four
apps use `base: './'`, so subpaths work without configuration). The atlas's
module drill-down links switch automatically: localhost ports in dev,
`/samal/` etc. in production builds.

## Publish (Cloudflare Pages, direct upload)

One-time: `npx wrangler login` (browser auth).

```sh
npx wrangler pages project create anatolian-crossroads --production-branch main   # once
npx wrangler pages deploy site --project-name anatolian-crossroads
```

The deployment URL is `https://anatolian-crossroads.pages.dev`; attach a
custom domain in the Cloudflare dashboard (Pages → project → Custom
domains). Netlify works identically if preferred: drag-and-drop `site/`, or
`npx netlify-cli deploy --dir site --prod`.

## After deploy

- Verify `/`, `/atlas/`, `/samal/`, `/gobeklitepe/`, `/kultepe/` and a
  drill-down link from an atlas site node.
- The Node version for CI builds is pinned via `.node-version` in each repo.

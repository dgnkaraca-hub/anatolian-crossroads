/**
 * Assemble the unified public site (Phase 0): build the macro atlas and the
 * three sibling micro modules, then compose everything under site/ for a
 * single-domain deploy:
 *
 *   /             landing page (landing/index.html)
 *   /atlas/       Anatolian Crossroads macro graph (this repo)
 *   /samal/       Sam'al Epigraphic Network
 *   /gobeklitepe/ Göbekli Tepe Network
 *   /kultepe/     Kültepe-Kaneš — Pūšu-kēn Family Network
 *
 * All four apps build with `base: './'`, so they are subpath-safe.
 * Run: npm run assemble-site   → deploy site/ (see docs/DEPLOY.md)
 */

import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const siblings = path.resolve(root, '..')
const site = path.join(root, 'site')

const APPS = [
  { name: 'atlas', dir: root, out: 'atlas' },
  { name: 'samal', dir: path.join(siblings, 'samal_digital_humanities'), out: 'samal' },
  {
    name: 'gobeklitepe',
    dir: path.join(siblings, 'gobeklitepe_digital_humanities'),
    out: 'gobeklitepe',
  },
  { name: 'kultepe', dir: path.join(siblings, 'kultepe_digital_humanities'), out: 'kultepe' },
]

for (const app of APPS) {
  if (!existsSync(app.dir)) {
    console.error(`missing sibling project: ${app.dir}`)
    process.exit(1)
  }
  console.log(`building ${app.name} (${app.dir}) ...`)
  execSync('npm run build', { cwd: app.dir, stdio: 'inherit' })
}

rmSync(site, { recursive: true, force: true })
mkdirSync(site, { recursive: true })

// Landing page at the root.
cpSync(path.join(root, 'landing', 'index.html'), path.join(site, 'index.html'))

// Each app under its subpath.
for (const app of APPS) {
  cpSync(path.join(app.dir, 'dist'), path.join(site, app.out), { recursive: true })
}

// Open-data files also served at /data/ for direct linking.
if (existsSync(path.join(root, 'data'))) {
  cpSync(path.join(root, 'data'), path.join(site, 'data'), { recursive: true })
}

// GitHub Pages: serve files verbatim (no Jekyll pass).
writeFileSync(path.join(site, '.nojekyll'), '')

console.log(`site/ assembled: landing + ${APPS.map((a) => '/' + a.out + '/').join(' ')} + /data/`)

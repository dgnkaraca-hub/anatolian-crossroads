/**
 * Print plates (stretch goal S2): the graphs rendered as an etching-style
 * series — cream paper, sepia ink, hatched discs, double plate rule, serif
 * cartouche. Layouts are computed headlessly (d3-force is deterministic
 * given fixed iteration counts; the map plate uses the same Mercator frame
 * as the app). Output: prints/plate-0*.svg, print-ready at A3.
 *
 * Run: npm run print-plates
 * For custom layouts, import the GEXF files from data/ into Gephi instead.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createServer } from 'vite'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force'
import { geoMercator } from 'd3-geo'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const kultepeRoot = path.resolve(root, '..', 'kultepe_digital_humanities')
const out = path.join(root, 'prints')

// --- plate geometry (A3 portrait) -----------------------------------------

const W = 1200
const H = 1697
const MARGIN = 90
const INK = '#3a2f22'
const INK_SOFT = '#6b5a44'
const PAPER = '#f0e8d6'

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Shared plate chrome: paper, double rule, hatch pattern defs, cartouche. */
function plate({ roman, title, subtitle, body }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="420mm" viewBox="0 0 ${W} ${H}" font-family="Iowan Old Style, Palatino, Georgia, serif">
  <defs>
    <pattern id="hatch" width="5" height="5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="5" stroke="${INK}" stroke-width="1.1"/>
    </pattern>
    <pattern id="hatch2" width="5" height="5" patternTransform="rotate(-45)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="5" stroke="${INK}" stroke-width="0.8"/>
    </pattern>
    <pattern id="stipple" width="6" height="6" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="0.7" fill="${INK}"/>
      <circle cx="4.5" cy="4.5" r="0.7" fill="${INK}"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <rect x="${MARGIN - 22}" y="${MARGIN - 22}" width="${W - 2 * (MARGIN - 22)}" height="${H - 2 * (MARGIN - 22)}" fill="none" stroke="${INK}" stroke-width="2.4"/>
  <rect x="${MARGIN - 12}" y="${MARGIN - 12}" width="${W - 2 * (MARGIN - 12)}" height="${H - 2 * (MARGIN - 12)}" fill="none" stroke="${INK}" stroke-width="0.8"/>
${body}
  <g text-anchor="middle" fill="${INK}">
    <text x="${W / 2}" y="${H - MARGIN - 46}" font-size="15" letter-spacing="6">ANATOLIAN CROSSROADS · PLATE ${roman}</text>
    <text x="${W / 2}" y="${H - MARGIN - 14}" font-size="24" font-style="italic">${esc(title)}</text>
    <text x="${W / 2}" y="${H - MARGIN + 12}" font-size="12.5" fill="${INK_SOFT}">${esc(subtitle)}</text>
  </g>
</svg>
`
}

function edgeStroke(relation) {
  if (relation === 'corridor') return `stroke="${INK}" stroke-width="1.6" stroke-dasharray="7 5"`
  if (relation === 'compares_with') return `stroke="${INK}" stroke-width="1.1" stroke-dasharray="2 4"`
  if (relation === 'interpreted_as') return `stroke="${INK_SOFT}" stroke-width="0.9" stroke-dasharray="1 3"`
  if (['father_of', 'mother_of', 'spouse_of'].includes(relation))
    return `stroke="${INK}" stroke-width="1.7"`
  if (['partner_of', 'agent_of'].includes(relation))
    return `stroke="${INK}" stroke-width="1.1" stroke-dasharray="7 5"`
  return `stroke="${INK_SOFT}" stroke-width="0.7"`
}

function nodeFill(type) {
  if (type === 'site' || type === 'actor') return 'url(#hatch)'
  if (type === 'concept') return 'url(#hatch2)'
  if (type === 'text' || type === 'phase') return 'url(#stipple)'
  return 'none' // interpretation: open circle
}

function nodeRadius(n, big) {
  if (n.type === 'site' || (n.type === 'actor' && big.has(n.id))) return 26
  if (n.type === 'actor') return 19
  if (n.type === 'concept') return 17
  if (n.type === 'text' || n.type === 'phase') return 15
  return 12
}

/** Deterministic force layout inside the plate frame. */
function layout(dataset, { chargeStrength = -900, distance = 190 }) {
  const nodes = dataset.nodes.map((n) => ({ ...n }))
  const links = dataset.edges.map((e) => ({ source: e.source, target: e.target, edge: e }))
  const big = new Set(['pushu-ken', 'lamassi'])
  const sim = forceSimulation(nodes)
    .force('link', forceLink(links).id((d) => d.id).distance(distance).strength(0.4))
    .force('charge', forceManyBody().strength(chargeStrength))
    .force('center', forceCenter(W / 2, (H - 140) / 2 + 40))
    .force('collide', forceCollide().radius((d) => nodeRadius(d, big) + 44))
    .stop()
  for (let i = 0; i < 400; i++) sim.tick()
  // Rescale the finished layout to fill the plate's content box evenly
  // (aspect preserved) instead of clamping — no edge distortion.
  const box = { x0: MARGIN + 90, y0: MARGIN + 130, x1: W - MARGIN - 90, y1: H - 420 }
  const xs = nodes.map((n) => n.x)
  const ys = nodes.map((n) => n.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const scale = Math.min(
    (box.x1 - box.x0) / Math.max(1, maxX - minX),
    (box.y1 - box.y0) / Math.max(1, maxY - minY),
  )
  const cx = (box.x0 + box.x1) / 2
  const cy = (box.y0 + box.y1) / 2
  for (const n of nodes) {
    n.x = cx + (n.x - (minX + maxX) / 2) * scale
    n.y = cy + (n.y - (minY + maxY) / 2) * scale
  }
  return { nodes, links, big }
}

function networkBody(dataset, opts) {
  const { nodes, links, big } = layout(dataset, opts)
  const pos = new Map(nodes.map((n) => [n.id, n]))
  const edges = links
    .map((l) => {
      const s = pos.get(l.edge.source)
      const t = pos.get(l.edge.target)
      return `  <line x1="${s.x.toFixed(1)}" y1="${s.y.toFixed(1)}" x2="${t.x.toFixed(1)}" y2="${t.y.toFixed(1)}" ${edgeStroke(l.edge.relation)}/>`
    })
    .join('\n')
  const discs = nodes
    .map((n) => {
      const r = nodeRadius(n, big)
      const label = n.label_en
      return [
        `  <circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${r}" fill="${nodeFill(n.type)}" stroke="${INK}" stroke-width="1.6"/>`,
        `  <text x="${n.x.toFixed(1)}" y="${(n.y + r + 20).toFixed(1)}" text-anchor="middle" font-size="14.5" font-style="italic" fill="${INK}">${esc(label)}</text>`,
      ].join('\n')
    })
    .join('\n')
  return `${edges}\n${discs}`
}

// --- Plate II: the site atlas (map) ----------------------------------------

function mapBody(dataset, basemap) {
  const frame = {
    type: 'MultiPoint',
    coordinates: [
      [basemap.MAP_BOUNDS.west, basemap.MAP_BOUNDS.south],
      [basemap.MAP_BOUNDS.east, basemap.MAP_BOUNDS.north],
    ],
  }
  const projection = geoMercator().fitExtent(
    [
      [MARGIN + 30, MARGIN + 120],
      [W - MARGIN - 30, H - 460],
    ],
    frame,
  )
  const lines = basemap.BASEMAP_LINES.map((line) => {
    const d = line.coords
      .map((c, i) => `${i === 0 ? 'M' : 'L'}${projection(c).map((v) => v.toFixed(1)).join(',')}`)
      .join(' ')
    const style =
      line.kind === 'coast'
        ? `stroke="${INK}" stroke-width="1.4"`
        : `stroke="${INK_SOFT}" stroke-width="1" stroke-dasharray="1 4"`
    return `  <path d="${d}" fill="none" ${style} stroke-linecap="round"/>`
  }).join('\n')

  const sites = dataset.nodes.filter((n) => n.type === 'site')
  const byId = new Map(sites.map((s) => [s.id, s]))
  const corridors = dataset.edges
    .filter((e) => e.relation === 'corridor' && byId.has(e.source) && byId.has(e.target))
    .map((e) => {
      const a = projection([byId.get(e.source).lng, byId.get(e.source).lat])
      const b = projection([byId.get(e.target).lng, byId.get(e.target).lat])
      return `  <line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" ${edgeStroke('corridor')}/>`
    })
    .join('\n')

  const LABEL_SHIFT = {
    samal: [-14, 30, 'end'],
    karatepe: [-14, -12, 'end'],
    karkamis: [14, 30, 'start'],
    sayburc: [-12, -14, 'end'],
    'gobekli-tepe': [14, 2, 'start'],
    karahantepe: [14, 26, 'start'],
    arslantepe: [14, -12, 'start'],
    kultepe: [-14, -12, 'end'],
  }
  const marks = sites
    .map((s) => {
      const [x, y] = projection([s.lng, s.lat])
      const [dx, dy, anchor] = LABEL_SHIFT[s.id] ?? [0, -16, 'middle']
      return [
        `  <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="url(#hatch)" stroke="${INK}" stroke-width="1.5"/>`,
        `  <text x="${(x + dx).toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${anchor}" font-size="15" font-style="italic" fill="${INK}">${esc(s.label_en)}</text>`,
      ].join('\n')
    })
    .join('\n')

  const geoLabels = [
    { lng: 33.5, lat: 41.6, text: 'Black Sea' },
    { lng: 30.8, lat: 35.5, text: 'Mediterranean Sea' },
    { lng: 39.6, lat: 36.1, text: 'Euphrates' },
    { lng: 42.1, lat: 37.8, text: 'Tigris' },
  ]
    .map(({ lng, lat, text }) => {
      const [x, y] = projection([lng, lat])
      return `  <text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" font-size="14" font-style="italic" letter-spacing="3" fill="${INK_SOFT}">${esc(text)}</text>`
    })
    .join('\n')

  return `${lines}\n${corridors}\n${marks}\n${geoLabels}`
}

// --- run --------------------------------------------------------------------

async function loadModule(projectRoot, modulePath) {
  const server = await createServer({
    root: projectRoot,
    server: { middlewareMode: true },
    logLevel: 'error',
  })
  try {
    return await server.ssrLoadModule(modulePath)
  } finally {
    await server.close()
  }
}

await mkdir(out, { recursive: true })

const { dataset: macro } = await loadModule(root, '/src/data/graph.ts')
const basemap = await loadModule(root, '/src/data/basemap.ts')
const { dataset: kultepe } = await loadModule(kultepeRoot, '/src/data/graph.ts')

await writeFile(
  path.join(out, 'plate-01-macro-network.svg'),
  plate({
    roman: 'I',
    title: 'The Macro Network',
    subtitle:
      'Ten sites, nine concepts, three readings apart — corridors dashed, comparisons dotted; every mark sourced. 9600–700 BCE.',
    body: networkBody(macro, { chargeStrength: -1050, distance: 200 }),
  }),
)
await writeFile(
  path.join(out, 'plate-02-site-atlas.svg'),
  plate({
    roman: 'II',
    title: 'The Site Atlas',
    subtitle:
      'Anatolia and Upper Mesopotamia, schematic: coastlines, the two rivers, ten sites and their corridors.',
    body: mapBody(macro, basemap),
  }),
)
await writeFile(
  path.join(out, 'plate-03-pushu-ken-family.svg'),
  plate({
    roman: 'III',
    title: 'The Pūšu-kēn Family',
    subtitle:
      'One Old Assyrian merchant house, c. 1900–1840 BCE — kinship solid, business dashed, texts stippled.',
    body: networkBody(kultepe, { chargeStrength: -800, distance: 165 }),
  }),
)

console.log('prints/ written: plate-01, plate-02, plate-03 (A3 SVG, etching style)')

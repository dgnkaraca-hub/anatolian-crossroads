/**
 * GEXF export (stretch goal S2, Gephi track): the macro atlas and the
 * Kültepe module as Gephi-ready graphs, written into data/. Attributes
 * carry type, confidence, dates and evidence class so Gephi styling can
 * mirror the app's encodings. Run: npm run export-gexf
 */

import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const kultepeRoot = path.resolve(root, '..', 'kultepe_digital_humanities')

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function toGexf(dataset, { title }) {
  const attrs = [
    { id: 'type', title: 'type', type: 'string', get: (n) => n.type },
    { id: 'confidence', title: 'confidence', type: 'string', get: (n) => n.confidence },
    { id: 'date_start', title: 'date_start', type: 'integer', get: (n) => n.date_start },
    { id: 'date_end', title: 'date_end', type: 'integer', get: (n) => n.date_end },
    { id: 'evidence', title: 'evidence', type: 'string', get: (n) => n.evidence_type },
    { id: 'sources', title: 'sources', type: 'string', get: (n) => n.sources.join('; ') },
  ]
  const nodesXml = dataset.nodes
    .map((n) => {
      const values = attrs
        .filter((a) => a.get(n) !== undefined && a.get(n) !== '')
        .map((a) => `        <attvalue for="${a.id}" value="${esc(a.get(n))}"/>`)
        .join('\n')
      return `      <node id="${esc(n.id)}" label="${esc(n.label_en)}">\n      <attvalues>\n${values}\n      </attvalues>\n      </node>`
    })
    .join('\n')
  const edgesXml = dataset.edges
    .map(
      (e, i) =>
        `      <edge id="${esc(e.id ?? i)}" source="${esc(e.source)}" target="${esc(e.target)}" label="${esc(e.relation)}">\n        <attvalues>\n          <attvalue for="e_relation" value="${esc(e.relation)}"/>\n          <attvalue for="e_confidence" value="${esc(e.confidence)}"/>\n        </attvalues>\n      </edge>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<gexf xmlns="http://gexf.net/1.3" version="1.3">
  <meta>
    <creator>Anatolian Crossroads</creator>
    <description>${esc(title)} — every node and edge sourced; see sources.md</description>
  </meta>
  <graph defaultedgetype="directed">
    <attributes class="node">
${attrs.map((a) => `      <attribute id="${a.id}" title="${a.title}" type="${a.type}"/>`).join('\n')}
    </attributes>
    <attributes class="edge">
      <attribute id="e_relation" title="relation" type="string"/>
      <attribute id="e_confidence" title="confidence" type="string"/>
    </attributes>
    <nodes>
${nodesXml}
    </nodes>
    <edges>
${edgesXml}
    </edges>
  </graph>
</gexf>
`
}

async function loadDataset(projectRoot, modulePath) {
  const server = await createServer({
    root: projectRoot,
    server: { middlewareMode: true },
    logLevel: 'error',
  })
  try {
    const mod = await server.ssrLoadModule(modulePath)
    return mod.dataset
  } finally {
    await server.close()
  }
}

const macro = await loadDataset(root, '/src/data/graph.ts')
await writeFile(
  path.join(root, 'data', 'anatolian-crossroads-macro.gexf'),
  toGexf(macro, { title: 'Anatolian Crossroads — macro atlas' }),
)
console.log(`macro GEXF: ${macro.nodes.length} nodes, ${macro.edges.length} edges`)

const kultepe = await loadDataset(kultepeRoot, '/src/data/graph.ts')
await writeFile(
  path.join(root, 'data', 'kultepe-pushu-ken-network.gexf'),
  toGexf(kultepe, { title: 'Kültepe-Kaneš — the Pūšu-kēn family network' }),
)
console.log(`kultepe GEXF: ${kultepe.nodes.length} nodes, ${kultepe.edges.length} edges`)

// Combined graph: the macro atlas plus the curated bridge layer — module
// evidence records attach to concepts and to their own site only, so the
// no-continuity rule holds in the combined graph too.
async function loadBridge() {
  const server = await createServer({
    root,
    server: { middlewareMode: true },
    logLevel: 'error',
  })
  try {
    const mod = await server.ssrLoadModule('/src/data/bridge.ts')
    return mod.BRIDGE
  } finally {
    await server.close()
  }
}

const bridge = await loadBridge()
const seen = new Set()
const bridgeNodes = []
for (const b of bridge) {
  const id = `${b.module}:${b.record}`
  if (seen.has(id)) continue
  seen.add(id)
  bridgeNodes.push({
    id,
    type: `module_record(${b.module})`,
    label_en: b.label_en,
    confidence: 'high',
    sources: b.sources,
  })
}
const combined = {
  nodes: [...macro.nodes, ...bridgeNodes],
  edges: [
    ...macro.edges,
    ...bridge.map((b, i) => ({
      id: `bridge-${i}`,
      source: `${b.module}:${b.record}`,
      target: b.macro,
      relation: 'module_evidence',
      confidence: 'high',
    })),
  ],
}
await writeFile(
  path.join(root, 'data', 'anatolian-crossroads-combined.gexf'),
  toGexf(combined, {
    title:
      'Anatolian Crossroads — macro atlas + module-evidence bridge (module records attach to concepts and their own sites only)',
  }),
)
console.log(
  `combined GEXF: ${combined.nodes.length} nodes, ${combined.edges.length} edges (${bridgeNodes.length} bridged module records)`,
)

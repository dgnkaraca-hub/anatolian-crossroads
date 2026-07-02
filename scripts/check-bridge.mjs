/**
 * Cross-repo bridge check: verify that every BridgeEntry.record actually
 * exists in its module's dataset. Run after editing src/data/bridge.ts:
 *
 *   npm run check-bridge
 *
 * Exits non-zero on any dangling reference — the bridge must never cite a
 * record that a module does not contain.
 */

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const siblings = path.resolve(root, '..')

const MODULE_ROOTS = {
  samal: path.join(siblings, 'samal_digital_humanities'),
  'gobekli-tepe': path.join(siblings, 'gobeklitepe_digital_humanities'),
  kultepe: path.join(siblings, 'kultepe_digital_humanities'),
}

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

const { BRIDGE } = await loadModule(root, '/src/data/bridge.ts')
const { validateBridge } = await loadModule(root, '/src/data/validate.ts')

const issues = validateBridge()

const recordIds = {}
for (const [key, moduleRoot] of Object.entries(MODULE_ROOTS)) {
  const { dataset } = await loadModule(moduleRoot, '/src/data/graph.ts')
  recordIds[key] = new Set(dataset.nodes.map((n) => n.id))
}

for (const b of BRIDGE) {
  const ids = recordIds[b.module]
  if (ids && !ids.has(b.record))
    issues.push(`bridge ${b.macro} -> ${b.module}:${b.record}: record not found in module dataset`)
}

if (issues.length > 0) {
  console.error(`bridge check FAILED (${issues.length} issues):`)
  for (const issue of issues) console.error('  -', issue)
  process.exit(1)
}
console.log(
  `bridge check OK — ${BRIDGE.length} entries, all records exist in their modules (` +
    Object.entries(recordIds)
      .map(([k, v]) => `${k}: ${v.size} records`)
      .join(', ') +
    ')',
)

/**
 * Build the open-data package in data/ from the TypeScript source of truth.
 * Uses Vite's SSR module loader so the exact same modules that power the app
 * (src/data/graph.ts, src/data/stories.ts, src/lib/serialize.ts) produce the
 * published files — no duplicated serialization logic.
 *
 * Run: npm run export-data
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'data')

const server = await createServer({
  root,
  server: { middlewareMode: true },
  logLevel: 'error',
})

try {
  const graph = await server.ssrLoadModule('/src/data/graph.ts')
  const validate = await server.ssrLoadModule('/src/data/validate.ts')
  const stories = await server.ssrLoadModule('/src/data/stories.ts')
  const serialize = await server.ssrLoadModule('/src/lib/serialize.ts')

  // Never publish a dataset that violates the disciplines.
  const issues = [...validate.validateGraph(), ...validate.validateStories()]
  if (issues.length > 0) {
    console.error('Refusing to export: dataset integrity issues:')
    for (const issue of issues) console.error('  -', issue)
    process.exit(1)
  }

  const { dataset } = graph
  await mkdir(outDir, { recursive: true })
  await writeFile(
    path.join(outDir, 'anatolian-crossroads-macro.json'),
    serialize.datasetToJson(dataset) + '\n',
  )
  await writeFile(path.join(outDir, 'nodes.csv'), serialize.nodesToCsv(dataset) + '\n')
  await writeFile(path.join(outDir, 'edges.csv'), serialize.edgesToCsv(dataset) + '\n')
  await writeFile(
    path.join(outDir, 'stories.json'),
    JSON.stringify(stories.STORIES, null, 2) + '\n',
  )

  console.log(
    `data/ written: ${dataset.nodes.length} nodes, ${dataset.edges.length} edges, ` +
      `${stories.STORIES.length} story routes — all sourced, 0 integrity issues.`,
  )
} finally {
  await server.close()
}

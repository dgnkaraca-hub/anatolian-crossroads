/**
 * Macro network: d3-force layout over sites, concepts and interpretations.
 * Edge styling encodes relation class (corridor / comparison / concept /
 * interpretation); node color encodes type. Coordinated with the map.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force'
import { select } from 'd3-selection'
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom'
import { drag } from 'd3-drag'
import type { GraphEdge, GraphNode } from '../types/schema'
import type { VisibleGraph } from '../lib/filter'
import { nodeLabel, type DataLang } from '../lib/i18n'

interface SimNode extends SimulationNodeDatum {
  id: string
  node: GraphNode
}
interface SimLink extends SimulationLinkDatum<SimNode> {
  edge: GraphEdge
}

interface Props {
  graph: VisibleGraph
  lang: DataLang
  selectedId: string | null
  hoveredId: string | null
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
}

const RELATION_CLASS: Record<string, string> = {
  corridor: 'edge-corridor',
  compares_with: 'edge-compare',
  relates_to_concept: 'edge-concept',
  interpreted_as: 'edge-interp',
  supported_by: 'edge-interp',
  disputed_by: 'edge-interp',
}

function nodeRadius(n: GraphNode): number {
  if (n.type === 'site') return 11
  if (n.type === 'concept') return 8
  return 6
}

export default function NetworkView({
  graph,
  lang,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const [size, setSize] = useState({ width: 600, height: 480 })
  const [, setTick] = useState(0)

  const simNodes = useMemo<SimNode[]>(
    () => graph.nodes.map((n) => ({ id: n.id, node: n })),
    [graph.nodes],
  )
  const simLinks = useMemo<SimLink[]>(
    () =>
      graph.edges.map((e) => ({
        source: e.source,
        target: e.target,
        edge: e,
      })),
    [graph.edges],
  )

  useEffect(() => {
    if (!containerRef.current) return
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) setSize({ width, height })
    })
    obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const simulationRef = useRef<ReturnType<typeof forceSimulation<SimNode>> | null>(null)

  useEffect(() => {
    const sim = forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance((l) =>
            l.edge.relation === 'relates_to_concept' ? 70 : 110,
          )
          .strength(0.35),
      )
      .force('charge', forceManyBody().strength(-320))
      .force('center', forceCenter(size.width / 2, size.height / 2))
      .force('collide', forceCollide<SimNode>().radius((d) => nodeRadius(d.node) + 14))
    // Settle synchronously first: d3's internal timer is rAF-based and can
    // be frozen in backgrounded tabs — the layout must not depend on it.
    sim.tick(160)
    setTick((t) => t + 1)
    sim.on('tick', () => setTick((t) => t + 1))
    simulationRef.current = sim
    return () => {
      sim.stop()
    }
  }, [simNodes, simLinks, size.width, size.height])

  // zoom + pan
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return
    const svg = select(svgRef.current)
    const g = select(gRef.current)
    const behavior: ZoomBehavior<SVGSVGElement, unknown> = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.35, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString())
      })
    svg.call(behavior)
    svg.call(behavior.transform, zoomIdentity)
    return () => {
      svg.on('.zoom', null)
    }
  }, [])

  // node dragging
  useEffect(() => {
    if (!gRef.current) return
    const g = select(gRef.current)
    const behavior = drag<SVGGElement, unknown>()
      .on('start', function (event) {
        const id = (this as SVGGElement).dataset.id
        const d = simNodes.find((n) => n.id === id)
        if (!d) return
        if (!event.active) simulationRef.current?.alphaTarget(0.25).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', function (event) {
        const id = (this as SVGGElement).dataset.id
        const d = simNodes.find((n) => n.id === id)
        if (!d) return
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', function (event) {
        const id = (this as SVGGElement).dataset.id
        const d = simNodes.find((n) => n.id === id)
        if (!d) return
        if (!event.active) simulationRef.current?.alphaTarget(0)
        d.fx = null
        d.fy = null
      })
    g.selectAll<SVGGElement, unknown>('g.net-node').call(behavior)
  }, [simNodes])

  const neighborIds = useMemo(() => {
    const focus = hoveredId ?? selectedId
    if (!focus) return null
    const ids = new Set<string>([focus])
    for (const e of graph.edges) {
      if (e.source === focus) ids.add(e.target)
      if (e.target === focus) ids.add(e.source)
    }
    return ids
  }, [hoveredId, selectedId, graph.edges])

  return (
    <div ref={containerRef} className="network-container">
      <svg
        ref={svgRef}
        width={size.width}
        height={size.height}
        onClick={() => onSelect(null)}
      >
        <g ref={gRef}>
          {simLinks.map((l) => {
            const s = l.source as SimNode
            const t = l.target as SimNode
            if (s.x === undefined || t.x === undefined) return null
            const focusDim =
              neighborIds !== null &&
              !(neighborIds.has(s.id) && neighborIds.has(t.id))
            const dim =
              focusDim || graph.dimmed.has(s.id) || graph.dimmed.has(t.id)
            return (
              <line
                key={l.edge.id}
                className={`net-edge ${RELATION_CLASS[l.edge.relation] ?? ''}${dim ? ' dim' : ''}`}
                x1={s.x}
                y1={s.y}
                x2={t.x}
                y2={t.y}
              />
            )
          })}
          {simNodes.map((d) => {
            if (d.x === undefined) return null
            const n = d.node
            const active = n.id === selectedId || n.id === hoveredId
            const dim =
              graph.dimmed.has(n.id) ||
              (neighborIds !== null && !neighborIds.has(n.id))
            return (
              <g
                key={n.id}
                data-id={n.id}
                className={`net-node type-${n.type}${active ? ' active' : ''}${dim ? ' dim' : ''}`}
                transform={`translate(${d.x},${d.y})`}
                onClick={(ev) => {
                  ev.stopPropagation()
                  onSelect(n.id)
                }}
                onMouseEnter={() => onHover(n.id)}
                onMouseLeave={() => onHover(null)}
              >
                <circle r={nodeRadius(n)} />
                <text dy={nodeRadius(n) + 12}>{nodeLabel(n, lang)}</text>
              </g>
            )
          })}
        </g>
      </svg>
      <div className="network-legend">
        <span className="legend-item"><i className="swatch site" /> site</span>
        <span className="legend-item"><i className="swatch concept" /> concept</span>
        <span className="legend-item"><i className="swatch interpretation" /> interpretation</span>
        <span className="legend-item"><i className="line corridor" /> corridor</span>
        <span className="legend-item"><i className="line compare" /> compares with</span>
        <span className="legend-item"><i className="line concept-edge" /> concept link</span>
      </div>
    </div>
  )
}

/**
 * Site atlas: schematic map of Anatolia / Upper Mesopotamia with site nodes
 * and corridor edges. Coordinated with the network view via shared
 * selection/hover state. Time slider dims sites outside the active year.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { geoMercator, geoPath, type GeoProjection } from 'd3-geo'
import { BASEMAP_LINES, MAP_BOUNDS } from '../data/basemap'
import type { GraphNode } from '../types/schema'
import type { VisibleGraph } from '../lib/filter'
import { nodeLabel, ui, type DataLang } from '../lib/i18n'

interface Props {
  graph: VisibleGraph
  lang: DataLang
  selectedId: string | null
  hoveredId: string | null
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
}

/**
 * Manual label placement for the dense Şanlıurfa/Amanus cluster; the map is
 * schematic and small, so a few hand offsets beat a collision solver.
 * dx/dy in px relative to the site dot; anchor defaults to "middle".
 */
const LABEL_OFFSETS: Record<
  string,
  { dx?: number; dy?: number; anchor?: 'start' | 'middle' | 'end' }
> = {
  samal: { dx: -8, dy: 18, anchor: 'end' },
  karatepe: { dx: -8, dy: -6, anchor: 'end' },
  karkamis: { dx: 8, dy: 18, anchor: 'start' },
  sayburc: { dx: -6, dy: -8, anchor: 'end' },
  'gobekli-tepe': { dx: 8, dy: 4, anchor: 'start' },
  karahantepe: { dx: 8, dy: 16, anchor: 'start' },
  arslantepe: { dx: 8, dy: -8, anchor: 'start' },
  kultepe: { dx: -8, dy: -8, anchor: 'end' },
}

function useSize(ref: React.RefObject<HTMLDivElement>) {
  const [size, setSize] = useState({ width: 600, height: 400 })
  useEffect(() => {
    if (!ref.current) return
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) setSize({ width, height })
    })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return size
}

export default function MapView({
  graph,
  lang,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height } = useSize(containerRef)

  const projection: GeoProjection = useMemo(() => {
    const frame = {
      type: 'MultiPoint' as const,
      coordinates: [
        [MAP_BOUNDS.west, MAP_BOUNDS.south],
        [MAP_BOUNDS.east, MAP_BOUNDS.north],
      ],
    }
    // Tight padding: let the map fill the panel (scholarly atlas, not inset).
    return geoMercator().fitExtent(
      [
        [10, 10],
        [width - 10, height - 10],
      ],
      frame,
    )
  }, [width, height])

  const path = useMemo(() => geoPath(projection), [projection])

  const sites = graph.nodes.filter((n) => n.type === 'site') as GraphNode[]
  const siteById = new Map(sites.map((s) => [s.id, s]))
  const corridors = graph.edges.filter(
    (e) =>
      e.relation === 'corridor' && siteById.has(e.source) && siteById.has(e.target),
  )

  function pos(node: GraphNode): [number, number] | null {
    if (node.lat === undefined || node.lng === undefined) return null
    return projection([node.lng, node.lat])
  }

  return (
    <div ref={containerRef} className="map-container">
      <svg width={width} height={height} onClick={() => onSelect(null)}>
        {/* graticule-like frame lines */}
        {BASEMAP_LINES.map((line) => (
          <path
            key={line.id}
            className={`basemap-${line.kind}`}
            d={
              path({
                type: 'LineString',
                coordinates: line.coords,
              }) ?? undefined
            }
          />
        ))}
        {/* river/sea labels */}
        <MapLabel projection={projection} lng={33.5} lat={41.6} text={ui('Black Sea', lang)} />
        <MapLabel
          projection={projection}
          lng={31.2}
          lat={35.6}
          text={ui('Mediterranean Sea', lang)}
        />
        <MapLabel projection={projection} lng={39.4} lat={36.15} text={ui('Euphrates', lang)} />
        <MapLabel projection={projection} lng={41.9} lat={37.75} text={ui('Tigris', lang)} />

        {/* corridor edges */}
        {corridors.map((e) => {
          const a = pos(siteById.get(e.source)!)
          const b = pos(siteById.get(e.target)!)
          if (!a || !b) return null
          const dim = graph.dimmed.has(e.source) || graph.dimmed.has(e.target)
          return (
            <line
              key={e.id}
              className={`map-corridor${dim ? ' dim' : ''}`}
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
            />
          )
        })}

        {/* site nodes */}
        {sites.map((s) => {
          const p = pos(s)
          if (!p) return null
          const dim = graph.dimmed.has(s.id)
          const active = s.id === selectedId || s.id === hoveredId
          const offset = LABEL_OFFSETS[s.id] ?? {}
          return (
            <g
              key={s.id}
              className={`map-site${dim ? ' dim' : ''}${active ? ' active' : ''}`}
              transform={`translate(${p[0]},${p[1]})`}
              onClick={(ev) => {
                ev.stopPropagation()
                onSelect(s.id)
              }}
              onMouseEnter={() => onHover(s.id)}
              onMouseLeave={() => onHover(null)}
            >
              <circle r={active ? 8 : 6} />
              <text
                dx={offset.dx ?? 0}
                dy={offset.dy ?? -10}
                textAnchor={offset.anchor ?? 'middle'}
              >
                {nodeLabel(s, lang)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function MapLabel({
  projection,
  lng,
  lat,
  text,
}: {
  projection: GeoProjection
  lng: number
  lat: number
  text: string
}) {
  const p = projection([lng, lat])
  if (!p) return null
  return (
    <text className="map-geo-label" x={p[0]} y={p[1]}>
      {text}
    </text>
  )
}

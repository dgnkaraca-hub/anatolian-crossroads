/**
 * Schematic basemap for the site atlas: simplified coastlines and the two
 * great rivers, hand-digitized at low resolution. This is a diagrammatic
 * ground (excavation-section aesthetic), not a cartographic product —
 * coordinates are approximate on purpose.
 */

export type LineFeature = {
  id: string
  label_en?: string
  kind: 'coast' | 'river'
  /** [lng, lat] pairs. */
  coords: [number, number][]
}

export const BASEMAP_LINES: LineFeature[] = [
  {
    id: 'black-sea-coast',
    label_en: 'Black Sea',
    kind: 'coast',
    coords: [
      [27.5, 40.98],
      [29.1, 41.22],
      [30.2, 41.2],
      [31.4, 41.85],
      [32.8, 41.98],
      [34.8, 42.02],
      [35.3, 41.7],
      [36.2, 41.25],
      [36.6, 41.3],
      [37.7, 41.1],
      [38.4, 40.92],
      [39.5, 41.0],
      [40.5, 41.2],
      [41.5, 41.45],
      [41.8, 41.4],
    ],
  },
  {
    id: 'aegean-coast',
    label_en: 'Aegean Sea',
    kind: 'coast',
    coords: [
      [26.7, 40.4],
      [26.2, 39.9],
      [26.7, 39.3],
      [26.8, 38.9],
      [27.0, 38.4],
      [26.7, 38.2],
      [27.2, 37.9],
      [27.2, 37.4],
      [27.5, 37.0],
    ],
  },
  {
    id: 'mediterranean-coast',
    label_en: 'Mediterranean Sea',
    kind: 'coast',
    coords: [
      [27.5, 37.0],
      [28.2, 36.8],
      [29.1, 36.6],
      [30.0, 36.25],
      [30.6, 36.85],
      [31.5, 36.8],
      [32.3, 36.3],
      [33.5, 36.15],
      [34.6, 36.3],
      [35.35, 36.55],
      [35.6, 36.55],
      [36.0, 36.9],
      [36.2, 36.6],
      [36.05, 36.2],
      [35.95, 35.9],
      [35.9, 35.4],
      [35.75, 34.9],
    ],
  },
  {
    id: 'euphrates',
    label_en: 'Euphrates',
    kind: 'river',
    coords: [
      [39.6, 39.4],
      [39.0, 38.95],
      [38.75, 38.75],
      [38.5, 38.4],
      [38.2, 38.1],
      [37.9, 37.8],
      [38.1, 37.45],
      [37.95, 37.1],
      [38.0, 36.83],
      [38.25, 36.5],
      [38.6, 36.05],
      [39.2, 35.9],
      [39.9, 35.55],
      [40.6, 35.15],
    ],
  },
  {
    id: 'tigris',
    label_en: 'Tigris',
    kind: 'river',
    coords: [
      [39.4, 38.5],
      [39.8, 38.2],
      [40.2, 37.92],
      [40.8, 37.7],
      [41.5, 37.55],
      [42.2, 37.35],
      [42.7, 37.1],
      [43.2, 36.8],
    ],
  },
]

/** Map view extent, chosen to frame all 10 sites with breathing room. */
export const MAP_BOUNDS = {
  west: 26.0,
  east: 43.5,
  south: 34.6,
  north: 42.4,
}

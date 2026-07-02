# Print series — etching plates (stretch goal S2)

Three A3 plates rendered directly from the project datasets in an
etching/engraving idiom: cream ground, single sepia ink, hatched and
stippled discs, double plate rule, serif cartouche. The same encodings as
the screen views, restated for paper:

| Plate | Subject | Encodings |
|---|---|---|
| I | The Macro Network | sites/actors hatched ⟋, concepts hatched ⟍, interpretations open circles; corridors dashed, comparisons dotted |
| II | The Site Atlas | schematic coasts and rivers, ten hatched site marks, corridor dashes |
| III | The Pūšu-kēn Family | kinship solid, business dashed, texts/phases stippled |

## Regenerating

```sh
npm run print-plates   # writes prints/plate-0*.svg (A3, 297×420 mm)
```

Layouts are computed headlessly with d3-force (fixed 400 ticks —
deterministic) and rescaled to the plate frame; the map plate reuses the
app's Mercator frame and basemap. Every mark derives from the sourced
datasets — the plates are *impressions of the data*, not illustrations.

## Custom layouts (Gephi track)

For hand-tuned exhibition layouts, import the GEXF files into Gephi:

```sh
npm run export-gexf    # data/anatolian-crossroads-macro.gexf
                       # data/kultepe-pushu-ken-network.gexf
```

Node attributes carry `type`, `confidence`, dates, evidence class and the
source keys, so partitions/filters in Gephi can mirror the app. Export from
Gephi as SVG/PDF and restyle with the palette above (ink `#3a2f22`, paper
`#f0e8d6`).

## Printing notes

- SVG is print-ready at A3 (297×420 mm); scales losslessly to A2/A1.
- For giclée/inkjet: convert at ≥300 dpi (e.g. Inkscape:
  `inkscape plate-01-macro-network.svg -o plate-01.png -d 300`).
- Papers that suit the idiom: warm cotton rag (Hahnemühle German Etching,
  BFK Rives). Consider letting the paper supply the ground and printing
  ink only (drop the background rect before export).

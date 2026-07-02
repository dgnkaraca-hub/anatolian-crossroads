# Sources — Anatolian Crossroads (macro level)

Institutional source list inherited from the handoff (BRIEF §9), expanded with
the bibliography keys used in `src/data/graph.ts`. Every node and edge in the
dataset cites at least one key below; `validateGraph()` enforces this at
runtime.

## Institutional / primary

| Key | Citation |
|---|---|
| UNESCO-1572 | UNESCO World Heritage Centre, "Göbekli Tepe" (ref. 1572). <https://whc.unesco.org/en/list/1572/> |
| UNESCO-1405 | UNESCO World Heritage Centre, "Neolithic Site of Çatalhöyük" (ref. 1405). <https://whc.unesco.org/en/list/1405/> |
| UNESCO-1622 | UNESCO World Heritage Centre, "Arslantepe Mound" (ref. 1622). <https://whc.unesco.org/en/list/1622/> |
| UNESCO-377 | UNESCO World Heritage Centre, "Hattusha: the Hittite Capital" (ref. 377). <https://whc.unesco.org/en/list/377/> |
| UNESCO-T5905 | UNESCO WHC Tentative Lists, "Archaeological Site of Kültepe-Kanesh" (ref. 5905). <https://whc.unesco.org/en/tentativelists/5905/> |
| UNESCO-MOW-KULTEPE | UNESCO Memory of the World Register, "The Old Assyrian Merchant Archives of Kültepe" (2015). <https://www.unesco.org/en/memory-world> |
| TASTEPELER | Taş Tepeler Project, Republic of Türkiye Ministry of Culture and Tourism / Şanlıurfa Neolithic research programme. |
| HITTITEMON-KARKAMIS | Bilgin, T. (ed.), Hittite Monuments, "Karkamış". <https://www.hittitemonuments.com/karkamis/> |
| ZINCIRLI-EXP | Chicago-Tübingen Archaeological Expedition to Zincirli (Sam'al), ISAC, University of Chicago. <https://zincirli.uchicago.edu/> |
| WSRP-KILAMUWA | USC West Semitic Research Project, Kilamuwa stele documentation. |
| MUZE-KARATEPE | Republic of Türkiye Ministry of Culture and Tourism, Karatepe-Aslantaş Open-Air Museum. <https://muze.gov.tr/> |

## Scholarly

| Key | Citation |
|---|---|
| OZDOGAN-2022 | Özdoğan, E. 2022. "The Sayburç reliefs: a narrative scene from the Neolithic". *Antiquity* 96 (390): 1599–1605. doi:10.15184/aqy.2022.125 |
| ISAC-KUTTAMUWA | Struble, E. J. & V. R. Herrmann 2009. "An Eternal Feast at Sam'al: The New Iron Age Mortuary Stele from Zincirli in Context". *BASOR* 356: 15–49. |
| SCHMIDT-2010 | Schmidt, K. 2010. "Göbekli Tepe — the Stone Age Sanctuaries". *Documenta Praehistorica* 37: 239–256. |

## Project-internal

| Key | Citation |
|---|---|
| AC-BRIEF | Anatolian Crossroads project brief v1 (2 July 2026), §2 — concept layer as analytic categories (docs/BRIEF.md). Used only on `concept` nodes, alongside an institutional anchor. |

## Notes

- Per BRIEF §9, the full URL list of the original handoff document should be
  merged here when that document is available; entries without URLs above
  (TASTEPELER, WSRP-KILAMUWA) are cited by institution and programme name.
- Interpretive claims never cite these sources as *proof* — they live in
  `interpretation` nodes with their own confidence tier.

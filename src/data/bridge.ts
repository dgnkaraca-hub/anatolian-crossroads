/**
 * Bridge layer (the "migration layer" promised in BRIEF §1): a curated,
 * machine-readable mapping from macro nodes (concepts and module sites) to
 * REAL records inside the three micro modules. This is how "everything is
 * connected" becomes data instead of spirit — without ever adding a
 * site-to-site edge: module evidence attaches to concepts and to its own
 * site only, so the no-continuity rule is untouched.
 *
 * Discipline: every entry cites its module dataset record AND a primary
 * anchor; record ids are verified against the sibling datasets by
 * scripts/check-bridge.mjs (run it after editing). Labels follow the
 * module's own spelling (e.g. Sam'al module writes "Katumuwa").
 */

import { MODULES } from './graph'

export interface BridgeEntry {
  /** Macro node id this evidence speaks to (a concept or a module site). */
  macro: string
  /** Module key (must exist in MODULES). */
  module: keyof typeof MODULES
  /** Record id inside the module's dataset (verified by check-bridge). */
  record: string
  label_en: string
  label_tr: string
  note_en: string
  note_tr: string
  /** Verbatim citations: module dataset record + primary anchor. */
  sources: string[]
}

export const BRIDGE: BridgeEntry[] = [
  // --- concept-memory -------------------------------------------------------
  {
    macro: 'concept-memory',
    module: 'samal',
    record: 'insc-katumuwa',
    label_en: 'Katumuwa stele',
    label_tr: 'Katumuwa steli',
    note_en:
      'Orders an ongoing feast for "my soul that is in this stele" — memory institutionalized as mortuary cult.',
    note_tr:
      '"Bu steldeki ruhum" için sürekli bir ziyafet vasiyet eder — ölü kültü olarak kurumsallaşan bellek.',
    sources: [
      "Sam'al Epigraphic Network dataset — insc-katumuwa",
      'Struble & Herrmann 2009, BASOR 356',
    ],
  },
  {
    macro: 'concept-memory',
    module: 'gobekli-tepe',
    record: 'enc-d',
    label_en: 'Enclosure D',
    label_tr: 'D Yapısı',
    note_en:
      'The best-preserved enclosure; the deliberate-backfilling debate makes it a case of monuments being buried — arguably remembered.',
    note_tr:
      'En iyi korunmuş yapı; bilinçli gömme tartışması onu gömülen — ve belki böylece hatırlanan — anıtların örneği yapar.',
    sources: ['Göbekli Tepe Network dataset — enc-d', 'Schmidt 2010, Documenta Praehistorica 37'],
  },
  {
    macro: 'concept-memory',
    module: 'kultepe',
    record: 'pushu-ken-archive',
    label_en: 'Pūšu-kēn archive',
    label_tr: 'Pūšu-kēn arşivi',
    note_en: 'A family remembering itself in writing: letters, contracts and accounts kept at home.',
    note_tr: 'Kendini yazıyla hatırlayan bir aile: evde saklanan mektuplar, sözleşmeler, hesaplar.',
    sources: ['Kültepe module dataset — pushu-ken-archive', 'UNESCO Memory of the World (Kültepe archives)'],
  },
  // --- concept-writing ------------------------------------------------------
  {
    macro: 'concept-writing',
    module: 'samal',
    record: 'insc-kilamuwa',
    label_en: 'Kilamuwa inscription',
    label_tr: 'Kilamuwa yazıtı',
    note_en: 'Royal alphabetic display inscription in Phoenician (KAI 24) on the palace orthostat.',
    note_tr: 'Saray ortostatı üzerinde Fenikece alfabetik kraliyet yazıtı (KAI 24).',
    sources: ["Sam'al Epigraphic Network dataset — insc-kilamuwa", 'KAI 24; USC WSRP documentation'],
  },
  {
    macro: 'concept-writing',
    module: 'kultepe',
    record: 'lamassi-letters',
    label_en: 'Letters of Lamassī',
    label_tr: 'Lamassī\'nin mektupları',
    note_en: 'Private correspondence as everyday literacy: a household running on cuneiform.',
    note_tr: 'Gündelik okuryazarlık olarak özel yazışma: çivi yazısıyla dönen bir hane.',
    sources: ['Kültepe module dataset — lamassi-letters', 'Michel 2020, Women of Assur and Kanesh'],
  },
  // --- concept-animal-symbolism --------------------------------------------
  {
    macro: 'concept-animal-symbolism',
    module: 'gobekli-tepe',
    record: 'pil-43',
    label_en: 'Pillar 43 ("Vulture Stone")',
    label_tr: '43 No.lu Dikilitaş ("Akbaba Taşı")',
    note_en: 'The densest animal composition of the site: vulture, scorpion, headless man.',
    note_tr: 'Alanın en yoğun hayvan kompozisyonu: akbaba, akrep, başsız adam.',
    sources: ['Göbekli Tepe Network dataset — pil-43', 'Schmidt 2010, Documenta Praehistorica 37'],
  },
  {
    macro: 'concept-animal-symbolism',
    module: 'gobekli-tepe',
    record: 'mot-fox',
    label_en: 'Fox motif',
    label_tr: 'Tilki motifi',
    note_en: 'A recurring predator across pillars and enclosures — a symbol system, not decoration.',
    note_tr: 'Dikilitaşlar ve yapılar boyunca yinelenen yırtıcı — süsleme değil, sembol sistemi.',
    sources: ['Göbekli Tepe Network dataset — mot-fox', 'Schmidt 2010, Documenta Praehistorica 37'],
  },
  // --- concept-body ---------------------------------------------------------
  {
    macro: 'concept-body',
    module: 'gobekli-tepe',
    record: 'pil-18',
    label_en: 'Pillar 18 (central pillar, Enclosure D)',
    label_tr: '18 No.lu Dikilitaş (D Yapısı merkez dikilitaşı)',
    note_en: 'Arms, hands and belt carved in relief — the body written onto stone (see the T-pillar reading).',
    note_tr: 'Kabartma kollar, eller ve kemer — taşa yazılmış beden (T-dikilitaş okumasına bakınız).',
    sources: ['Göbekli Tepe Network dataset — pil-18', 'Schmidt 2010, Documenta Praehistorica 37'],
  },
  {
    macro: 'concept-body',
    module: 'gobekli-tepe',
    record: 'mot-headless-man',
    label_en: 'Headless man motif',
    label_tr: 'Başsız adam motifi',
    note_en: 'The human body fragmented and displayed — read alongside later skull practices in the region.',
    note_tr: 'Parçalanıp sergilenen insan bedeni — bölgenin sonraki kafatası uygulamalarıyla birlikte okunur.',
    sources: ['Göbekli Tepe Network dataset — mot-headless-man', 'Schmidt 2010, Documenta Praehistorica 37'],
  },
  // --- concept-multilingualism ---------------------------------------------
  {
    macro: 'concept-multilingualism',
    module: 'samal',
    record: 'lang-samalian',
    label_en: 'Sam\'alian (with Phoenician and Aramaic)',
    label_tr: 'Sam\'alca (Fenikece ve Aramice ile birlikte)',
    note_en: 'One royal corpus, three languages: Kilamuwa writes Phoenician; later kings shift to Sam\'alian and Aramaic.',
    note_tr: 'Tek kraliyet külliyatı, üç dil: Kilamuwa Fenikece yazdırır; sonraki krallar Sam\'alca ve Aramiceye geçer.',
    sources: ["Sam'al Epigraphic Network dataset — lang-samalian", 'KAI 24, 214-215; Zincirli expedition'],
  },
  {
    macro: 'concept-multilingualism',
    module: 'kultepe',
    record: 'kanesh',
    label_en: 'Kaneš, an Anatolian host city',
    label_tr: 'Bir Anadolu ev sahibi kent olarak Kaneš',
    note_en: 'Old Assyrian archives inside an Anatolian city — the region\'s multilingualism at street level.',
    note_tr: 'Bir Anadolu kentinin içinde Eski Asur arşivleri — bölge çokdilliliğinin sokak düzeyi.',
    sources: ['Kültepe module dataset — kanesh', 'UNESCO Memory of the World (Kültepe archives)'],
  },
  // --- concept-ritual --------------------------------------------------------
  {
    macro: 'concept-ritual',
    module: 'gobekli-tepe',
    record: 'enc-d',
    label_en: 'Enclosure D',
    label_tr: 'D Yapısı',
    note_en: 'Communal ceremonial architecture: twin central pillars ringed by decorated uprights.',
    note_tr: 'Toplu tören mimarlığı: bezemeli dikilitaşlarla çevrili ikiz merkez dikilitaşlar.',
    sources: ['Göbekli Tepe Network dataset — enc-d', 'UNESCO WHC 1572 (OUV)'],
  },
  {
    macro: 'concept-ritual',
    module: 'samal',
    record: 'insc-hadad',
    label_en: 'Hadad statue inscription',
    label_tr: 'Hadad heykeli yazıtı',
    note_en: 'Panamuwa I\'s inscription on the colossal statue of Hadad ties kingship to cult.',
    note_tr: 'Panamuwa I\'in devasa Hadad heykeli üzerindeki yazıtı krallığı kültle bağlar.',
    sources: ["Sam'al Epigraphic Network dataset — insc-hadad", 'KAI 214'],
  },
  // --- concept-trade ----------------------------------------------------------
  {
    macro: 'concept-trade',
    module: 'kultepe',
    record: 'vengeance-dossier',
    label_en: '"Year of Vengeance" dossier',
    label_tr: '"İntikam Yılı" dosyası',
    note_en: 'One reconstructed trade year: caravans, credit, disputes — the network in motion.',
    note_tr: 'Yeniden kurulmuş bir ticaret yılı: kervanlar, kredi, ihtilaflar — hareket hâlindeki ağ.',
    sources: ['Kültepe module dataset — vengeance-dossier', 'Stratford 2017, A Year of Vengeance'],
  },
  // --- concept-power -----------------------------------------------------------
  {
    macro: 'concept-power',
    module: 'samal',
    record: 'insc-panamuwa-ii',
    label_en: 'Panamuwa II inscription',
    label_tr: 'Panamuwa II yazıtı',
    note_en: 'Royal legitimation under Assyrian patronage — power narrated in the first person.',
    note_tr: 'Asur himayesinde kraliyet meşruiyeti — birinci tekil şahısla anlatılan iktidar.',
    sources: ["Sam'al Epigraphic Network dataset — insc-panamuwa-ii", 'KAI 215'],
  },
  // --- concept-border-kingdoms ---------------------------------------------------
  {
    macro: 'concept-border-kingdoms',
    module: 'samal',
    record: 'insc-kilamuwa',
    label_en: 'Kilamuwa inscription',
    label_tr: 'Kilamuwa yazıtı',
    note_en: '"I hired the king of Assyria" — a border king narrating how he plays the great powers.',
    note_tr: '"Asur kralını kiraladım" — büyük güçleri nasıl oynadığını anlatan bir sınır kralı.',
    sources: ["Sam'al Epigraphic Network dataset — insc-kilamuwa", 'KAI 24'],
  },
  // --- module sites: drill-down highlights -----------------------------------
  {
    macro: 'samal',
    module: 'samal',
    record: 'insc-katumuwa',
    label_en: 'Katumuwa stele',
    label_tr: 'Katumuwa steli',
    note_en: 'The module\'s emblematic record: soul, feast and stone in one text.',
    note_tr: 'Modülün simge kaydı: ruh, ziyafet ve taş tek metinde.',
    sources: ["Sam'al Epigraphic Network dataset — insc-katumuwa", 'Struble & Herrmann 2009, BASOR 356'],
  },
  {
    macro: 'samal',
    module: 'samal',
    record: 'king-kilamuwa',
    label_en: 'Kilamuwa',
    label_tr: 'Kilamuwa',
    note_en: 'The king whose Phoenician orthostat anchors the dynasty\'s epigraphy.',
    note_tr: 'Fenikece ortostatı hanedan epigrafisinin çapası olan kral.',
    sources: ["Sam'al Epigraphic Network dataset — king-kilamuwa", 'KAI 24'],
  },
  {
    macro: 'gobekli-tepe',
    module: 'gobekli-tepe',
    record: 'enc-d',
    label_en: 'Enclosure D',
    label_tr: 'D Yapısı',
    note_en: 'The best-preserved enclosure and the heart of the module\'s network.',
    note_tr: 'En iyi korunmuş yapı ve modül ağının kalbi.',
    sources: ['Göbekli Tepe Network dataset — enc-d', 'UNESCO WHC 1572'],
  },
  {
    macro: 'gobekli-tepe',
    module: 'gobekli-tepe',
    record: 'pil-43',
    label_en: 'Pillar 43 ("Vulture Stone")',
    label_tr: '43 No.lu Dikilitaş ("Akbaba Taşı")',
    note_en: 'The site\'s most discussed relief composition.',
    note_tr: 'Alanın en çok tartışılan kabartma kompozisyonu.',
    sources: ['Göbekli Tepe Network dataset — pil-43', 'Schmidt 2010'],
  },
  {
    macro: 'kultepe',
    module: 'kultepe',
    record: 'lamassi-letters',
    label_en: 'Letters of Lamassī',
    label_tr: 'Lamassī\'nin mektupları',
    note_en: 'The module\'s most vivid voice: textiles, children, and pressure to come home.',
    note_tr: 'Modülün en canlı sesi: kumaşlar, çocuklar ve eve dön baskısı.',
    sources: ['Kültepe module dataset — lamassi-letters', 'Michel 2020'],
  },
  {
    macro: 'kultepe',
    module: 'kultepe',
    record: 'ahaha',
    label_en: 'Ahaha',
    label_tr: 'Ahaha',
    note_en: 'Priestess and investor who fights for her share of the estate in writing.',
    note_tr: 'Mirastaki payı için yazıyla mücadele eden rahibe ve yatırımcı.',
    sources: ['Kültepe module dataset — ahaha', 'Michel 2020'],
  },
]

/** Bridge entries for a macro node, in stable module order. */
export function bridgeFor(macroId: string): BridgeEntry[] {
  return BRIDGE.filter((b) => b.macro === macroId)
}

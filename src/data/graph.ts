/**
 * Anatolian Crossroads — macro-level seed dataset (Phase 1).
 *
 * 10 site nodes, 9 concept nodes, 3 exemplar interpretation nodes, and
 * corridor / concept / comparison / interpretation edges. Every record is
 * sourced from the institutional list in BRIEF §9; interpretive links are
 * downgraded ("medium"/"speculative") unless a source states them.
 *
 * Methodological safeguard: sites never link to each other at the evidence
 * level. Site-to-site edges are ONLY geographic corridors or explicit
 * comparative pairs; thematic connections run through concept nodes.
 */

import type { Dataset, GraphEdge, GraphNode } from '../types/schema'

// ---------------------------------------------------------------------------
// Bibliography (keys used in sources[] below, expanded here and in sources.md)
// ---------------------------------------------------------------------------

const bibliography: Record<string, string> = {
  'UNESCO-1572':
    'UNESCO World Heritage Centre, "Göbekli Tepe" (ref. 1572). https://whc.unesco.org/en/list/1572/',
  'UNESCO-1405':
    'UNESCO World Heritage Centre, "Neolithic Site of Çatalhöyük" (ref. 1405). https://whc.unesco.org/en/list/1405/',
  'UNESCO-1622':
    'UNESCO World Heritage Centre, "Arslantepe Mound" (ref. 1622). https://whc.unesco.org/en/list/1622/',
  'UNESCO-377':
    'UNESCO World Heritage Centre, "Hattusha: the Hittite Capital" (ref. 377). https://whc.unesco.org/en/list/377/',
  'UNESCO-T5905':
    'UNESCO World Heritage Centre, Tentative Lists, "Archaeological Site of Kültepe-Kanesh" (ref. 5905). https://whc.unesco.org/en/tentativelists/5905/',
  'UNESCO-MOW-KULTEPE':
    'UNESCO Memory of the World Register, "The Old Assyrian Merchant Archives of Kültepe" (inscribed 2015). https://www.unesco.org/en/memory-world',
  TASTEPELER:
    'Taş Tepeler Project, Republic of Türkiye Ministry of Culture and Tourism / Şanlıurfa Neolithic research programme (Karahantepe, Sayburç and related sites).',
  'OZDOGAN-2022':
    'Özdoğan, E. 2022. "The Sayburç reliefs: a narrative scene from the Neolithic". Antiquity 96 (390): 1599-1605. doi:10.15184/aqy.2022.125',
  'HITTITEMON-KARKAMIS':
    'Bilgin, T. (ed.), Hittite Monuments, "Karkamış". https://www.hittitemonuments.com/karkamis/',
  'ZINCIRLI-EXP':
    'Chicago-Tübingen Archaeological Expedition to Zincirli (Sam\'al), Institute for the Study of Ancient Cultures, University of Chicago. https://zincirli.uchicago.edu/',
  'ISAC-KUTTAMUWA':
    'Struble, E. J. & V. R. Herrmann 2009. "An Eternal Feast at Sam\'al: The New Iron Age Mortuary Stele from Zincirli in Context". BASOR 356: 15-49 (Kuttamuwa stele, ISAC/Neubauer Expedition).',
  'WSRP-KILAMUWA':
    'USC West Semitic Research Project, Kilamuwa stele documentation (Zincirli, Phoenician inscription of Kilamuwa).',
  'MUZE-KARATEPE':
    'Republic of Türkiye Ministry of Culture and Tourism, Karatepe-Aslantaş Open-Air Museum. https://muze.gov.tr/',
  'SCHMIDT-2010':
    'Schmidt, K. 2010. "Göbekli Tepe — the Stone Age Sanctuaries: New results of ongoing excavations with a special focus on sculptures and high reliefs". Documenta Praehistorica 37: 239-256.',
  'AC-BRIEF':
    'Anatolian Crossroads project brief v1 (2 July 2026), §2: concept layer as analytic categories of the comparative model (docs/BRIEF.md).',
}

// ---------------------------------------------------------------------------
// Nodes — 10 sites (chronological backbone, BRIEF §3)
// ---------------------------------------------------------------------------

const siteNodes: GraphNode[] = [
  {
    id: 'gobekli-tepe',
    type: 'site',
    label_en: 'Göbekli Tepe',
    label_tr: 'Göbekli Tepe',
    date_start: -9600,
    date_end: -8200,
    lat: 37.2233,
    lng: 38.9224,
    modern_location: 'Şanlıurfa, Türkiye',
    ancient_region: 'Upper Mesopotamia (Urfa plateau)',
    summary_en:
      'Pre-Pottery Neolithic monumental enclosures with carved T-shaped pillars; pre-literate ritual architecture built by hunter-gatherer communities.',
    summary_tr:
      'Çanak Çömleksiz Neolitik döneme ait, kabartmalı T-biçimli dikilitaşlı anıtsal yapılar; avcı-toplayıcı topluluklarca inşa edilmiş, yazı öncesi ritüel mimarlık.',
    evidence_type: 'pillar',
    confidence: 'high',
    sources: ['UNESCO-1572'],
    source_urls: ['https://whc.unesco.org/en/list/1572/'],
    notes: 'Micro module exists (Göbekli Tepe Network, port 5186).',
  },
  {
    id: 'karahantepe',
    type: 'site',
    label_en: 'Karahantepe',
    label_tr: 'Karahantepe',
    date_start: -9500,
    date_end: -8000,
    lat: 37.0935,
    lng: 39.3033,
    modern_location: 'Şanlıurfa, Türkiye',
    ancient_region: 'Upper Mesopotamia (Tektek mountains)',
    summary_en:
      'Taş Tepeler flagship site: rock-cut structures, T-shaped pillars and striking human/animal sculpture, part of the regional Neolithic symbol network.',
    summary_tr:
      'Taş Tepeler projesinin öncü kazısı: ana kayaya oyulmuş yapılar, T-biçimli dikilitaşlar ve çarpıcı insan/hayvan heykelleriyle bölgesel Neolitik sembol ağının parçası.',
    evidence_type: 'pillar',
    confidence: 'high',
    sources: ['TASTEPELER'],
    notes:
      'Dates approximate (excavation ongoing); coordinates approximate to the Tektek plateau location.',
  },
  {
    id: 'sayburc',
    type: 'site',
    label_en: 'Sayburç',
    label_tr: 'Sayburç',
    date_start: -8800,
    date_end: -8000,
    lat: 37.1,
    lng: 38.55,
    modern_location: 'Şanlıurfa, Türkiye',
    ancient_region: 'Upper Mesopotamia (Urfa plateau)',
    summary_en:
      'Neolithic settlement beneath a modern village; a wall relief showing humans and animals together has been published as one of the earliest narrative scenes.',
    summary_tr:
      'Modern bir köyün altındaki Neolitik yerleşim; insan ve hayvanları bir arada gösteren duvar kabartması, en erken anlatı sahnelerinden biri olarak yayımlandı.',
    evidence_type: 'relief',
    confidence: 'high',
    sources: ['OZDOGAN-2022', 'TASTEPELER'],
    notes:
      '9th millennium BCE; date span and coordinates approximate (site lies under the modern village).',
  },
  {
    id: 'catalhoyuk',
    type: 'site',
    label_en: 'Çatalhöyük',
    label_tr: 'Çatalhöyük',
    date_start: -7400,
    date_end: -5200,
    lat: 37.6664,
    lng: 32.8286,
    modern_location: 'Konya, Türkiye',
    ancient_region: 'Konya plain (Central Anatolia)',
    summary_en:
      'Large Neolithic settlement of densely clustered houses; wall paintings, bucrania and intramural burials record household and community memory.',
    summary_tr:
      'Sıkışık evlerden oluşan büyük Neolitik yerleşim; duvar resimleri, boğa başları ve ev içi gömüler hane ile topluluk belleğini kaydeder.',
    evidence_type: 'wall_painting',
    confidence: 'high',
    sources: ['UNESCO-1405'],
    source_urls: ['https://whc.unesco.org/en/list/1405/'],
  },
  {
    id: 'arslantepe',
    type: 'site',
    label_en: 'Arslantepe',
    label_tr: 'Arslantepe',
    date_start: -4300,
    date_end: -3100,
    lat: 38.3814,
    lng: 38.361,
    modern_location: 'Malatya, Türkiye',
    ancient_region: 'Upper Euphrates valley',
    summary_en:
      'Mound with a 4th-millennium palatial complex: mass sealings, storage and redistribution — administration and power before full writing.',
    summary_tr:
      'MÖ 4. binyıla ait saray kompleksli höyük: toplu mühür baskıları, depolama ve yeniden dağıtım — tam yazı öncesinde yönetim ve iktidar.',
    evidence_type: 'seal',
    confidence: 'high',
    sources: ['UNESCO-1622'],
    source_urls: ['https://whc.unesco.org/en/list/1622/'],
    notes:
      'Macro window shown: Late Chalcolithic development through the period VI A palace (c. 3400-3100 BCE). The mound also has later Bronze/Iron Age phases (Neo-Hittite Melid) outside this v1 scope.',
  },
  {
    id: 'kultepe',
    type: 'site',
    label_en: 'Kültepe-Kaneš',
    label_tr: 'Kültepe-Kaneš',
    date_start: -1950,
    date_end: -1750,
    lat: 38.85,
    lng: 35.635,
    modern_location: 'Kayseri, Türkiye',
    ancient_region: 'Central Anatolia (kārum network hub)',
    summary_en:
      'Old Assyrian trade colony (kārum) beside the local city: tens of thousands of cuneiform tablets record merchants, contracts and families — the rise of written memory.',
    summary_tr:
      'Yerli kentin yanındaki Eski Asur ticaret kolonisi (kārum): on binlerce çivi yazılı tablet tüccarları, sözleşmeleri ve aileleri kaydeder — yazılı belleğin yükselişi.',
    evidence_type: 'tablet',
    confidence: 'high',
    sources: ['UNESCO-T5905', 'UNESCO-MOW-KULTEPE'],
    source_urls: ['https://whc.unesco.org/en/tentativelists/5905/'],
    notes:
      'Micro module exists (Pūšu-kēn family network, port 5191). Coordinates approximate (c. 20 km NE of Kayseri).',
  },
  {
    id: 'hattusa',
    type: 'site',
    label_en: 'Hattuşa / Yazılıkaya',
    label_tr: 'Hattuşa / Yazılıkaya',
    date_start: -1650,
    date_end: -1180,
    lat: 40.0189,
    lng: 34.6156,
    modern_location: 'Boğazkale, Çorum, Türkiye',
    ancient_region: 'Hittite core territory (Halys bend)',
    summary_en:
      'Hittite imperial capital: monumental urban plan, cuneiform archives in several languages, and the Yazılıkaya rock sanctuary — memory institutionalized by a state.',
    summary_tr:
      'Hitit imparatorluk başkenti: anıtsal kent planı, birden çok dilde çivi yazılı arşivler ve Yazılıkaya kaya tapınağı — belleğin devlet eliyle kurumsallaşması.',
    evidence_type: 'architecture',
    confidence: 'high',
    sources: ['UNESCO-377'],
    source_urls: ['https://whc.unesco.org/en/list/377/'],
  },
  {
    id: 'karkamis',
    type: 'site',
    label_en: 'Karkamış',
    label_tr: 'Karkamış',
    date_start: -1200,
    date_end: -700,
    lat: 36.8317,
    lng: 38.0156,
    modern_location: 'Gaziantep, Türkiye',
    ancient_region: 'Middle Euphrates crossing',
    summary_en:
      'City commanding the Euphrates crossing; former Hittite viceregal seat, then the leading Iron Age city-state with monumental Luwian hieroglyphic inscriptions and reliefs.',
    summary_tr:
      'Fırat geçidini denetleyen kent; önce Hitit kral naipliği merkezi, ardından anıtsal Luvi hiyeroglif yazıtları ve kabartmalarıyla Demir Çağı\'nın önde gelen kent devleti.',
    evidence_type: 'inscription',
    confidence: 'high',
    sources: ['HITTITEMON-KARKAMIS'],
    source_urls: ['https://www.hittitemonuments.com/karkamis/'],
    notes:
      'Macro window shows the Iron Age city-state; the Late Bronze Age viceregal phase is recorded in the corridor edge to Hattuşa.',
  },
  {
    id: 'samal',
    type: 'site',
    label_en: "Sam'al / Zincirli",
    label_tr: "Sam'al / Zincirli",
    date_start: -920,
    date_end: -713,
    lat: 37.1042,
    lng: 36.6775,
    modern_location: 'Zincirli Höyük, Gaziantep, Türkiye',
    ancient_region: 'Eastern foot of the Amanus range',
    summary_en:
      'Iron Age border kingdom with a circular walled city; royal inscriptions in Phoenician, Sam\'alian and Aramaic, and the Kuttamuwa mortuary stele.',
    summary_tr:
      'Dairesel surlu Demir Çağı sınır krallığı; Fenikece, Sam\'alca ve Aramice kraliyet yazıtları ve Kuttamuwa mezar steli.',
    evidence_type: 'stele',
    confidence: 'high',
    sources: ['ZINCIRLI-EXP', 'WSRP-KILAMUWA'],
    source_urls: ['https://zincirli.uchicago.edu/'],
    notes: "Micro module exists (Sam'al Epigraphic Network, port 5185).",
  },
  {
    id: 'karatepe',
    type: 'site',
    label_en: 'Karatepe-Aslantaş',
    label_tr: 'Karatepe-Aslantaş',
    date_start: -800,
    date_end: -650,
    lat: 37.2975,
    lng: 36.2436,
    modern_location: 'Osmaniye, Türkiye',
    ancient_region: 'Eastern Cilicia (Ceyhan valley)',
    summary_en:
      'Border fortress of Azatiwada with sculpted gatehouses and the long Phoenician–Luwian bilingual inscription, a key to deciphering Anatolian hieroglyphs.',
    summary_tr:
      'Azatiwada\'nın kabartmalı kapı yapılarına sahip sınır kalesi; uzun Fenikece-Luvice çift dilli yazıtı Anadolu hiyerogliflerinin çözümünde anahtar oldu.',
    evidence_type: 'inscription',
    confidence: 'high',
    sources: ['MUZE-KARATEPE'],
    notes: '8th-7th century BCE; the Azatiwada inscription dates around 700 BCE.',
  },
]

// ---------------------------------------------------------------------------
// Nodes — 9 concepts (the shared layer all cross-site meaning flows through)
// ---------------------------------------------------------------------------

const CONCEPT_NOTE =
  'Analytic category defined by the project (comparative lens), not an archaeological claim about the sites themselves.'

const conceptNodes: GraphNode[] = [
  {
    id: 'concept-ritual',
    type: 'concept',
    label_en: 'Ritual',
    label_tr: 'Ritüel',
    summary_en:
      'Communal ceremonial practice and the built spaces that stage it, from Neolithic enclosures to imperial rock sanctuaries.',
    summary_tr:
      'Neolitik yapılardan imparatorluk kaya tapınaklarına, topluluk törenleri ve onları sahneleyen mekânlar.',
    confidence: 'high',
    sources: ['AC-BRIEF', 'UNESCO-1572'],
    notes: CONCEPT_NOTE,
  },
  {
    id: 'concept-body',
    type: 'concept',
    label_en: 'Body',
    label_tr: 'Beden',
    summary_en:
      'The human body as a medium of memory: burials, plastered skulls, anthropomorphic sculpture and images of the human figure.',
    summary_tr:
      'Bellek aracı olarak insan bedeni: gömüler, sıvalı kafatasları, insan biçimli heykeller ve insan figürü imgeleri.',
    confidence: 'high',
    sources: ['AC-BRIEF', 'UNESCO-1405'],
    notes: CONCEPT_NOTE,
  },
  {
    id: 'concept-animal-symbolism',
    type: 'concept',
    label_en: 'Animal symbolism',
    label_tr: 'Hayvan sembolizmi',
    summary_en:
      'Wild and powerful animals as carriers of meaning: carved predators, bucrania, gate lions and relief menageries.',
    summary_tr:
      'Anlam taşıyıcısı olarak yabani ve güçlü hayvanlar: kabartma yırtıcılar, boğa başları, kapı aslanları ve kabartma hayvan dizileri.',
    confidence: 'high',
    sources: ['AC-BRIEF', 'UNESCO-1572'],
    notes: CONCEPT_NOTE,
  },
  {
    id: 'concept-writing',
    type: 'concept',
    label_en: 'Writing',
    label_tr: 'Yazı',
    summary_en:
      'Recording systems from administrative sealing to cuneiform archives and monumental alphabetic or hieroglyphic display inscriptions.',
    summary_tr:
      'Yönetsel mühürlemeden çivi yazılı arşivlere, anıtsal alfabetik ve hiyeroglif yazıtlara uzanan kayıt sistemleri.',
    confidence: 'high',
    sources: ['AC-BRIEF', 'UNESCO-MOW-KULTEPE'],
    notes: CONCEPT_NOTE,
  },
  {
    id: 'concept-power',
    type: 'concept',
    label_en: 'Power',
    label_tr: 'İktidar',
    summary_en:
      'Institutionalized authority made visible: palaces, citadels, royal self-presentation and urban plans.',
    summary_tr:
      'Görünür kılınan kurumsal otorite: saraylar, kaleler, kraliyet öz-temsili ve kent planları.',
    confidence: 'high',
    sources: ['AC-BRIEF', 'UNESCO-1622'],
    notes: CONCEPT_NOTE,
  },
  {
    id: 'concept-trade',
    type: 'concept',
    label_en: 'Trade',
    label_tr: 'Ticaret',
    summary_en:
      'Exchange networks and their infrastructures: storage and redistribution, merchant colonies, river crossings.',
    summary_tr:
      'Değişim ağları ve altyapıları: depolama ve yeniden dağıtım, tüccar kolonileri, nehir geçitleri.',
    confidence: 'high',
    sources: ['AC-BRIEF', 'UNESCO-MOW-KULTEPE'],
    notes: CONCEPT_NOTE,
  },
  {
    id: 'concept-memory',
    type: 'concept',
    label_en: 'Memory',
    label_tr: 'Bellek',
    summary_en:
      'Deliberate acts of remembering: curated houses and burials, backfilled monuments, mortuary cult and commemorative stelae.',
    summary_tr:
      'Bilinçli hatırlama edimleri: kuşaklar boyu korunan evler ve gömüler, gömülen anıtlar, ölü kültü ve anma stelleri.',
    confidence: 'high',
    sources: ['AC-BRIEF', 'ISAC-KUTTAMUWA'],
    notes: CONCEPT_NOTE,
  },
  {
    id: 'concept-multilingualism',
    type: 'concept',
    label_en: 'Multilingualism',
    label_tr: 'Çokdillilik',
    summary_en:
      'More than one language or script in one place: bilingual display inscriptions, multilingual archives, code choice as politics.',
    summary_tr:
      'Aynı yerde birden çok dil ya da yazı: çift dilli anıt yazıtları, çok dilli arşivler, siyaset olarak dil seçimi.',
    confidence: 'high',
    sources: ['AC-BRIEF', 'WSRP-KILAMUWA'],
    notes: CONCEPT_NOTE,
  },
  {
    id: 'concept-border-kingdoms',
    type: 'concept',
    label_en: 'Border kingdoms',
    label_tr: 'Sınır krallıkları',
    summary_en:
      'Small polities on imperial edges that turn their in-between position into identity, wealth and monumental display.',
    summary_tr:
      'İmparatorluk kıyısındaki küçük devletler: aradalık konumunu kimliğe, zenginliğe ve anıtsal gösterime çeviren siyasi yapılar.',
    confidence: 'high',
    sources: ['AC-BRIEF', 'ZINCIRLI-EXP'],
    notes: CONCEPT_NOTE,
  },
]

// ---------------------------------------------------------------------------
// Nodes — exemplar interpretation layer (readings live apart from evidence)
// ---------------------------------------------------------------------------

const interpretationNodes: GraphNode[] = [
  {
    id: 'interp-t-pillars-anthropomorphic',
    type: 'interpretation',
    label_en: 'T-pillars as anthropomorphic beings',
    label_tr: 'T-dikilitaşlar insan biçimli varlıklar olarak',
    summary_en:
      'Reading advanced by the excavator: arms, hands and belts carved on central pillars mark them as stylized beings, not plain architecture.',
    summary_tr:
      'Kazı başkanının önerdiği okuma: merkez dikilitaşlara işlenen kol, el ve kemerler onları yalın mimarlık değil, stilize varlıklar olarak imler.',
    confidence: 'medium',
    sources: ['SCHMIDT-2010'],
    notes:
      'Widely followed but still an interpretation; what the pillars "are" is not stated by any ancient source.',
  },
  {
    id: 'interp-kuttamuwa-soul',
    type: 'interpretation',
    label_en: 'Kuttamuwa stele implies a soul dwelling in the stone',
    label_tr: 'Kuttamuwa steli taşta yaşayan bir ruh inancını imler',
    summary_en:
      'The inscription commissions feasts for "my soul that is in this stele" — read as evidence for a belief that the deceased\'s soul resides in the monument.',
    summary_tr:
      'Yazıt "bu stelde olan ruhum" için ziyafetler vasiyet eder — ölünün ruhunun anıtta barındığı inancının kanıtı olarak okunur.',
    confidence: 'high',
    sources: ['ISAC-KUTTAMUWA'],
    notes:
      'The phrase is in the text itself; the wider theological reading remains discussed in the literature.',
  },
  {
    id: 'interp-sayburc-narrative',
    type: 'interpretation',
    label_en: 'Sayburç relief as one of the earliest narrative scenes',
    label_tr: 'Sayburç kabartması en erken anlatı sahnelerinden biri olarak',
    summary_en:
      'The published reading: the two related vignettes (leopards flanking a man; a man facing a bull) form a coherent story, an early narrative composition.',
    summary_tr:
      'Yayımlanan okuma: iki bağlantılı sahne (bir adamı kuşatan leoparlar; boğayla yüzleşen adam) tutarlı bir öykü, erken bir anlatı kompozisyonu oluşturur.',
    confidence: 'medium',
    sources: ['OZDOGAN-2022'],
    notes: 'Author\'s interpretive claim in the Antiquity article; "narrative" status is a reading.',
  },
]

// ---------------------------------------------------------------------------
// Edges — corridors (geography, drawn on the map)
// ---------------------------------------------------------------------------

const corridorEdges: GraphEdge[] = [
  {
    id: 'cor-gobekli-karahan',
    source: 'gobekli-tepe',
    target: 'karahantepe',
    relation: 'corridor',
    label_en: 'Şanlıurfa plateau (Taş Tepeler)',
    label_tr: 'Şanlıurfa platosu (Taş Tepeler)',
    confidence: 'high',
    sources: ['TASTEPELER'],
    evidence_note:
      'Both sites belong to the same regional cluster of PPN sites investigated under the Taş Tepeler programme (~35 km apart).',
  },
  {
    id: 'cor-karahan-sayburc',
    source: 'karahantepe',
    target: 'sayburc',
    relation: 'corridor',
    label_en: 'Şanlıurfa plateau (Taş Tepeler)',
    label_tr: 'Şanlıurfa platosu (Taş Tepeler)',
    confidence: 'high',
    sources: ['TASTEPELER', 'OZDOGAN-2022'],
    evidence_note: 'Sayburç is investigated within the same Şanlıurfa Neolithic research region.',
  },
  {
    id: 'cor-arslantepe-karkamis',
    source: 'arslantepe',
    target: 'karkamis',
    relation: 'corridor',
    label_en: 'Euphrates corridor',
    label_tr: 'Fırat koridoru',
    confidence: 'high',
    sources: ['UNESCO-1622', 'HITTITEMON-KARKAMIS'],
    evidence_note:
      'Both sites sit on the Euphrates axis: Arslantepe in the upper valley, Karkamış at the great middle crossing. Geographic corridor only.',
  },
  {
    id: 'cor-hattusa-karkamis',
    source: 'hattusa',
    target: 'karkamis',
    relation: 'corridor',
    label_en: 'Hittite imperial road to the Euphrates frontier',
    label_tr: 'Hitit imparatorluk yolu — Fırat sınırına',
    confidence: 'high',
    sources: ['HITTITEMON-KARKAMIS', 'UNESCO-377'],
    evidence_note:
      'In the Late Bronze Age Karkamış was the seat of Hittite viceroys governing the Syrian territories from the Euphrates crossing.',
  },
  {
    id: 'cor-kultepe-hattusa',
    source: 'kultepe',
    target: 'hattusa',
    relation: 'corridor',
    label_en: 'Old Assyrian kārum network',
    label_tr: 'Eski Asur kārum ağı',
    confidence: 'high',
    sources: ['UNESCO-MOW-KULTEPE', 'UNESCO-T5905'],
    evidence_note:
      'The kārum trade network centred at Kaneš included a station at Hattuš; the route is documented in the Kültepe tablets.',
  },
  {
    id: 'cor-samal-karatepe',
    source: 'samal',
    target: 'karatepe',
    relation: 'corridor',
    label_en: 'Amanus passes / Cilician frontier',
    label_tr: 'Amanos geçitleri / Kilikya sınır hattı',
    confidence: 'medium',
    sources: ['ZINCIRLI-EXP', 'MUZE-KARATEPE'],
    evidence_note:
      "Sam'al controls the eastern foot of the Amanus, Karatepe the Ceyhan valley to its west; the corridor is the mountain-pass axis between them.",
  },
  {
    id: 'cor-karkamis-samal',
    source: 'karkamis',
    target: 'samal',
    relation: 'corridor',
    label_en: 'North Syrian route',
    label_tr: 'Kuzey Suriye yolu',
    confidence: 'medium',
    sources: ['HITTITEMON-KARKAMIS', 'ZINCIRLI-EXP'],
    evidence_note:
      'East-west route linking the Euphrates crossing to the Amanus foothills across the Iron Age city-state landscape.',
  },
]

// ---------------------------------------------------------------------------
// Edges — explicit comparative pairs (never continuity)
// ---------------------------------------------------------------------------

const comparisonEdges: GraphEdge[] = [
  {
    id: 'cmp-gobekli-sayburc',
    source: 'gobekli-tepe',
    target: 'sayburc',
    relation: 'compares_with',
    label_en: 'Shared image repertoire',
    label_tr: 'Ortak imge dağarcığı',
    confidence: 'high',
    sources: ['OZDOGAN-2022'],
    evidence_note:
      'The Sayburç publication explicitly compares the relief\'s leopards, bull and human figures with the Göbekli Tepe / Urfa-region repertoire.',
  },
  {
    id: 'cmp-gobekli-catalhoyuk',
    source: 'gobekli-tepe',
    target: 'catalhoyuk',
    relation: 'compares_with',
    label_en: 'Monumental vs. household symbolism',
    label_tr: 'Anıtsal ve hane sembolizmi karşılaştırması',
    confidence: 'medium',
    sources: ['UNESCO-1572', 'UNESCO-1405'],
    evidence_note:
      'A standard comparative pair in Neolithic scholarship (wild-animal imagery in communal monuments vs. domestic contexts). Comparison only; the sites are separated by centuries and 500 km.',
  },
  {
    id: 'cmp-samal-karatepe',
    source: 'samal',
    target: 'karatepe',
    relation: 'compares_with',
    label_en: 'Border kingdoms with gate sculpture and display inscriptions',
    label_tr: 'Kapı heykelleri ve anıt yazıtlı sınır krallıkları',
    confidence: 'high',
    sources: ['ZINCIRLI-EXP', 'MUZE-KARATEPE', 'WSRP-KILAMUWA'],
    evidence_note:
      'Both are small Iron Age polities using sculpted gateways and Phoenician-language royal inscriptions (Kilamuwa; Azatiwada) for self-presentation.',
  },
  {
    id: 'cmp-karkamis-karatepe',
    source: 'karkamis',
    target: 'karatepe',
    relation: 'compares_with',
    label_en: 'Luwian hieroglyphic monumental tradition',
    label_tr: 'Luvi hiyeroglif anıt geleneği',
    confidence: 'high',
    sources: ['HITTITEMON-KARKAMIS', 'MUZE-KARATEPE'],
    evidence_note:
      'Both sites carry monumental Luwian hieroglyphic inscriptions with reliefs; Karatepe adds the Phoenician bilingual.',
  },
  {
    id: 'cmp-arslantepe-kultepe',
    source: 'arslantepe',
    target: 'kultepe',
    relation: 'compares_with',
    label_en: 'Administrative technologies: sealing vs. writing',
    label_tr: 'Yönetim teknolojileri: mühürleme ve yazı karşılaştırması',
    confidence: 'medium',
    sources: ['UNESCO-1622', 'UNESCO-T5905'],
    evidence_note:
      'Comparative pair on the administration-to-writing trajectory (mass sealing systems vs. full cuneiform archives). No direct link between the sites is claimed.',
  },
]

// ---------------------------------------------------------------------------
// Edges — site → concept (the only path cross-site meaning may take)
// ---------------------------------------------------------------------------

function conceptEdge(
  site: string,
  concept: string,
  confidence: GraphEdge['confidence'],
  sources: string[],
  evidence_note: string,
): GraphEdge {
  return {
    id: `con-${site}--${concept.replace('concept-', '')}`,
    source: site,
    target: concept,
    relation: 'relates_to_concept',
    confidence,
    sources,
    evidence_note,
  }
}

const conceptEdges: GraphEdge[] = [
  // ritual
  conceptEdge('gobekli-tepe', 'concept-ritual', 'high', ['UNESCO-1572'],
    'Monumental enclosures interpreted as communal/ritual gathering places (OUV statement).'),
  conceptEdge('karahantepe', 'concept-ritual', 'high', ['TASTEPELER'],
    'Special-purpose rock-cut structures with pillars and sculpture.'),
  conceptEdge('sayburc', 'concept-ritual', 'medium', ['OZDOGAN-2022'],
    'Relief decorates a communal (special) building within the settlement.'),
  conceptEdge('catalhoyuk', 'concept-ritual', 'high', ['UNESCO-1405'],
    'Ritual installations (bucrania, paintings, burial rites) inside houses.'),
  conceptEdge('hattusa', 'concept-ritual', 'high', ['UNESCO-377'],
    'Temples in the city and the Yazılıkaya rock sanctuary with its god processions.'),
  // body
  conceptEdge('gobekli-tepe', 'concept-body', 'medium', ['SCHMIDT-2010'],
    'Central pillars carry carved arms, hands and belts (see interpretation node).'),
  conceptEdge('karahantepe', 'concept-body', 'high', ['TASTEPELER'],
    'Human sculpture and the chamber with human-head protomes.'),
  conceptEdge('sayburc', 'concept-body', 'high', ['OZDOGAN-2022'],
    'Human figures are protagonists of the relief scene.'),
  conceptEdge('catalhoyuk', 'concept-body', 'high', ['UNESCO-1405'],
    'Intramural burials beneath house platforms; skull retrieval and plastering.'),
  // animal symbolism
  conceptEdge('gobekli-tepe', 'concept-animal-symbolism', 'high', ['UNESCO-1572'],
    'Predator and wild-animal reliefs on the T-pillars.'),
  conceptEdge('karahantepe', 'concept-animal-symbolism', 'high', ['TASTEPELER'],
    'Animal sculpture and reliefs (snakes, leopards, birds of prey).'),
  conceptEdge('sayburc', 'concept-animal-symbolism', 'high', ['OZDOGAN-2022'],
    'Leopards and a bull flank the human figures in the relief.'),
  conceptEdge('catalhoyuk', 'concept-animal-symbolism', 'high', ['UNESCO-1405'],
    'Bull imagery (bucrania, paintings) and leopard reliefs.'),
  conceptEdge('karkamis', 'concept-animal-symbolism', 'high', ['HITTITEMON-KARKAMIS'],
    'Orthostat reliefs with lions, bulls and mythological creatures.'),
  conceptEdge('samal', 'concept-animal-symbolism', 'high', ['ZINCIRLI-EXP'],
    'Gate lions and orthostat animal reliefs of the citadel.'),
  conceptEdge('karatepe', 'concept-animal-symbolism', 'high', ['MUZE-KARATEPE'],
    'Sculpted gate lions and sphinxes; relief menagerie of the gatehouses.'),
  // writing
  conceptEdge('arslantepe', 'concept-writing', 'medium', ['UNESCO-1622'],
    'Mass sealing administration: recording before script (pre-writing bureaucracy).'),
  conceptEdge('kultepe', 'concept-writing', 'high', ['UNESCO-MOW-KULTEPE'],
    'Tens of thousands of Old Assyrian cuneiform tablets.'),
  conceptEdge('hattusa', 'concept-writing', 'high', ['UNESCO-377'],
    'State cuneiform archives; hieroglyphic Luwian on seals and monuments.'),
  conceptEdge('karkamis', 'concept-writing', 'high', ['HITTITEMON-KARKAMIS'],
    'Monumental Luwian hieroglyphic display inscriptions.'),
  conceptEdge('samal', 'concept-writing', 'high', ['ZINCIRLI-EXP', 'WSRP-KILAMUWA'],
    'Royal alphabetic inscriptions (Kilamuwa, Panamuwa, Bar-Rakib group).'),
  conceptEdge('karatepe', 'concept-writing', 'high', ['MUZE-KARATEPE'],
    'The long Azatiwada bilingual (Phoenician / hieroglyphic Luwian).'),
  // power
  conceptEdge('arslantepe', 'concept-power', 'high', ['UNESCO-1622'],
    '4th-millennium palatial complex with centralized storage and redistribution.'),
  conceptEdge('hattusa', 'concept-power', 'high', ['UNESCO-377'],
    'Imperial capital: fortifications, temples, royal citadel of Büyükkale.'),
  conceptEdge('karkamis', 'concept-power', 'high', ['HITTITEMON-KARKAMIS'],
    'Viceregal seat, then leading Iron Age city-state on the Euphrates.'),
  conceptEdge('samal', 'concept-power', 'high', ['ZINCIRLI-EXP'],
    'Fortified royal city with palace complexes (bīt-ḫilāni) and royal stelae.'),
  conceptEdge('karatepe', 'concept-power', 'high', ['MUZE-KARATEPE'],
    'Fortress of a local ruler proclaiming his deeds at the gates.'),
  // trade
  conceptEdge('kultepe', 'concept-trade', 'high', ['UNESCO-MOW-KULTEPE'],
    'Old Assyrian merchant colony: tin and textile trade, contracts, partnerships.'),
  conceptEdge('arslantepe', 'concept-trade', 'high', ['UNESCO-1622'],
    'Centralized storage and redistribution economy of the palace phase.'),
  conceptEdge('karkamis', 'concept-trade', 'medium', ['HITTITEMON-KARKAMIS'],
    'Wealth of the city tied to control of the Euphrates crossing.'),
  // memory
  conceptEdge('catalhoyuk', 'concept-memory', 'high', ['UNESCO-1405'],
    'Houses rebuilt in place over generations above ancestral burials.'),
  conceptEdge('gobekli-tepe', 'concept-memory', 'medium', ['SCHMIDT-2010'],
    'Enclosures were deliberately backfilled — monuments entombed, arguably remembered.'),
  conceptEdge('samal', 'concept-memory', 'high', ['ISAC-KUTTAMUWA'],
    'Kuttamuwa stele institutes an ongoing mortuary feast for the deceased.'),
  conceptEdge('hattusa', 'concept-memory', 'medium', ['UNESCO-377'],
    'Yazılıkaya linked to dynastic commemoration (Chamber B and Tudhaliya IV).'),
  // multilingualism
  conceptEdge('samal', 'concept-multilingualism', 'high', ['ZINCIRLI-EXP', 'WSRP-KILAMUWA'],
    'Phoenician, Sam\'alian and Aramaic used across one royal corpus.'),
  conceptEdge('karatepe', 'concept-multilingualism', 'high', ['MUZE-KARATEPE'],
    'Phoenician–Luwian bilingual display inscription.'),
  conceptEdge('kultepe', 'concept-multilingualism', 'high', ['UNESCO-MOW-KULTEPE'],
    'Old Assyrian archives in an Anatolian host city; earliest Hittite personal names.'),
  conceptEdge('hattusa', 'concept-multilingualism', 'high', ['UNESCO-377'],
    'Archives preserve Hittite, Luwian, Hattic, Hurrian, Akkadian and more.'),
  // border kingdoms
  conceptEdge('samal', 'concept-border-kingdoms', 'high', ['ZINCIRLI-EXP'],
    'Small kingdom between Assyria, Aramean and Luwian spheres.'),
  conceptEdge('karatepe', 'concept-border-kingdoms', 'high', ['MUZE-KARATEPE'],
    'Frontier fortress of the kingdom of Adana (Hiyawa) facing the Taurus.'),
  conceptEdge('karkamis', 'concept-border-kingdoms', 'high', ['HITTITEMON-KARKAMIS'],
    'City-state holding the imperial frontier crossing after Hatti\'s fall.'),
]

// ---------------------------------------------------------------------------
// Edges — interpretation layer
// ---------------------------------------------------------------------------

const interpretationEdges: GraphEdge[] = [
  {
    id: 'int-gobekli-t-pillars',
    source: 'gobekli-tepe',
    target: 'interp-t-pillars-anthropomorphic',
    relation: 'interpreted_as',
    confidence: 'medium',
    sources: ['SCHMIDT-2010'],
    evidence_note:
      'Carved arms/hands/belts on central pillars are the evidence; "anthropomorphic beings" is the reading.',
  },
  {
    id: 'int-karahan-t-pillars',
    source: 'karahantepe',
    target: 'interp-t-pillars-anthropomorphic',
    relation: 'interpreted_as',
    confidence: 'speculative',
    sources: ['TASTEPELER', 'SCHMIDT-2010'],
    evidence_note:
      'Extension of the Göbekli Tepe reading to Karahantepe\'s pillars; plausible but not stated for this site in the cited publication.',
  },
  {
    id: 'int-samal-kuttamuwa',
    source: 'samal',
    target: 'interp-kuttamuwa-soul',
    relation: 'interpreted_as',
    confidence: 'high',
    sources: ['ISAC-KUTTAMUWA'],
    evidence_note:
      'The stele\'s own text ("my soul that is in this stele") grounds the reading; its theological scope is debated.',
  },
  {
    id: 'int-sayburc-narrative',
    source: 'sayburc',
    target: 'interp-sayburc-narrative',
    relation: 'interpreted_as',
    confidence: 'medium',
    sources: ['OZDOGAN-2022'],
    evidence_note: 'Reading proposed in the primary publication of the relief.',
  },
]

// ---------------------------------------------------------------------------
// Dataset
// ---------------------------------------------------------------------------

export const dataset: Dataset = {
  nodes: [...siteNodes, ...conceptNodes, ...interpretationNodes],
  edges: [...corridorEdges, ...comparisonEdges, ...conceptEdges, ...interpretationEdges],
  meta: {
    title: 'Anatolian Crossroads',
    subtitle: 'A Memory Graph from Neolithic Symbols to Iron Age Inscriptions',
    scope:
      'Macro level: 10 sites (9600-700 BCE), 9 concepts, exemplar interpretation layer. Comparative network — no continuity claims.',
    bibliography,
  },
}

const nodeIndex = new Map(dataset.nodes.map((n) => [n.id, n]))

export function getNode(id: string): GraphNode | undefined {
  return nodeIndex.get(id)
}

/** Distinct bibliography keys actually cited by nodes/edges. */
export function allSources(): string[] {
  const used = new Set<string>()
  for (const n of dataset.nodes) n.sources.forEach((s) => used.add(s))
  for (const e of dataset.edges) e.sources.forEach((s) => used.add(s))
  return [...used].sort()
}

/**
 * Micro modules that exist as sibling projects (drill-down targets).
 * In dev each module runs on its fixed port; in the assembled production
 * site all modules live under one domain (see scripts/assemble-site.mjs).
 */
const DEV = import.meta.env.DEV

export const MODULES: Record<
  string,
  { label: string; label_tr: string; url: string }
> = {
  // Production paths are relative to the atlas at <root>/atlas/, so the
  // assembled site works at a domain root and under a subpath (GitHub Pages).
  samal: {
    label: "Sam'al Epigraphic Network",
    label_tr: "Sam'al Epigrafik Ağı",
    url: DEV ? 'http://localhost:5185/' : '../samal/',
  },
  'gobekli-tepe': {
    label: 'Göbekli Tepe Network',
    label_tr: 'Göbekli Tepe Ağı',
    url: DEV ? 'http://localhost:5186/' : '../gobeklitepe/',
  },
  kultepe: {
    label: 'Kültepe-Kaneš — Pūšu-kēn Family Network',
    label_tr: 'Kültepe-Kaneš — Pūšu-kēn Aile Ağı',
    url: DEV ? 'http://localhost:5191/' : '../kultepe/',
  },
}

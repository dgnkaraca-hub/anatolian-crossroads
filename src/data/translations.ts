/**
 * Turkish translations for curatorial free-text fields (edge evidence notes
 * and node notes), keyed by the records' STABLE ids. Kept apart from
 * graph.ts so the dataset structure, identifiers, sources and record counts
 * stay untouched — every entry here maps 1:1 onto an existing source-backed
 * record. English remains the canonical text; the panel falls back to it.
 */

/** Turkish renderings of the `ancient_region` field, keyed by site id. */
export const ANCIENT_REGION_TR: Record<string, string> = {
  'gobekli-tepe': 'Yukarı Mezopotamya (Urfa platosu)',
  karahantepe: 'Yukarı Mezopotamya (Tektek Dağları)',
  sayburc: 'Yukarı Mezopotamya (Urfa platosu)',
  catalhoyuk: 'Konya Ovası (İç Anadolu)',
  arslantepe: 'Yukarı Fırat vadisi',
  kultepe: 'İç Anadolu (kārum ağının merkezi)',
  hattusa: 'Hitit çekirdek bölgesi (Kızılırmak kavsi)',
  karkamis: 'Orta Fırat geçidi',
  samal: 'Amanosların doğu eteği',
  karatepe: 'Doğu Kilikya (Ceyhan vadisi)',
}

export const NODE_NOTES_TR: Record<string, string> = {
  'gobekli-tepe': 'Mikro modülü mevcuttur (Göbekli Tepe Ağı, port 5186).',
  karahantepe:
    'Tarihler yaklaşıktır (kazı sürmektedir); koordinatlar Tektek Dağları\'ndaki konuma göre yaklaşık verilmiştir.',
  sayburc:
    'MÖ 9. binyıl; tarih aralığı ve koordinatlar yaklaşıktır (yerleşim modern köyün altındadır).',
  arslantepe:
    'Gösterilen makro pencere: Geç Kalkolitik gelişimden VI A dönemi sarayına (y. MÖ 3400–3100). Höyükte bu v1 kapsamının dışında kalan daha geç Tunç/Demir Çağı evreleri de (Geç Hitit Melid) vardır.',
  kultepe:
    "Mikro modülü mevcuttur (Pūšu-kēn aile ağı, port 5191). Koordinatlar yaklaşıktır (Kayseri'nin yaklaşık 20 km kuzeydoğusu).",
  karkamis:
    'Makro pencere Demir Çağı kent devletini gösterir; Geç Tunç Çağı naiplik evresi Hattuşa koridor bağlantısında kayıtlıdır.',
  samal: "Mikro modülü mevcuttur (Sam'al Epigrafik Ağı, port 5185).",
  karatepe: "MÖ 8.–7. yüzyıl; Azatiwada yazıtı yaklaşık MÖ 700'e tarihlenir.",
  // concept nodes share one analytic-category note
  'concept-ritual': 'Projenin tanımladığı analitik kategori (karşılaştırma merceği); yerleşimlerin kendileri hakkında arkeolojik bir iddia değildir.',
  'concept-body': 'Projenin tanımladığı analitik kategori (karşılaştırma merceği); yerleşimlerin kendileri hakkında arkeolojik bir iddia değildir.',
  'concept-animal-symbolism': 'Projenin tanımladığı analitik kategori (karşılaştırma merceği); yerleşimlerin kendileri hakkında arkeolojik bir iddia değildir.',
  'concept-writing': 'Projenin tanımladığı analitik kategori (karşılaştırma merceği); yerleşimlerin kendileri hakkında arkeolojik bir iddia değildir.',
  'concept-power': 'Projenin tanımladığı analitik kategori (karşılaştırma merceği); yerleşimlerin kendileri hakkında arkeolojik bir iddia değildir.',
  'concept-trade': 'Projenin tanımladığı analitik kategori (karşılaştırma merceği); yerleşimlerin kendileri hakkında arkeolojik bir iddia değildir.',
  'concept-memory': 'Projenin tanımladığı analitik kategori (karşılaştırma merceği); yerleşimlerin kendileri hakkında arkeolojik bir iddia değildir.',
  'concept-multilingualism': 'Projenin tanımladığı analitik kategori (karşılaştırma merceği); yerleşimlerin kendileri hakkında arkeolojik bir iddia değildir.',
  'concept-border-kingdoms': 'Projenin tanımladığı analitik kategori (karşılaştırma merceği); yerleşimlerin kendileri hakkında arkeolojik bir iddia değildir.',
  'interp-t-pillars-anthropomorphic':
    'Yaygın kabul görse de bir yorumdur; dikilitaşların "ne olduğu"nu söyleyen hiçbir antik kaynak yoktur.',
  'interp-kuttamuwa-soul':
    'İfade metnin kendisindedir; daha geniş teolojik okuma literatürde tartışılmaya devam etmektedir.',
  'interp-sayburc-narrative':
    'Antiquity makalesindeki yazarın yorumsal iddiasıdır; "anlatı" statüsü bir okumadır.',
}

export const EDGE_NOTES_TR: Record<string, string> = {
  // --- corridors ---
  'cor-gobekli-karahan':
    'İki yerleşim de Taş Tepeler programı kapsamında araştırılan aynı bölgesel Çanak Çömleksiz Neolitik kümesine aittir (~35 km arayla).',
  'cor-karahan-sayburc':
    'Sayburç, aynı Şanlıurfa Neolitik araştırma bölgesi içinde incelenmektedir.',
  'cor-arslantepe-karkamis':
    'İki yerleşim de Fırat ekseni üzerindedir: Arslantepe yukarı vadide, Karkamış büyük orta geçitte. Yalnızca coğrafi koridordur.',
  'cor-hattusa-karkamis':
    'Geç Tunç Çağı\'nda Karkamış, Suriye topraklarını Fırat geçidinden yöneten Hitit naiplerinin merkeziydi.',
  'cor-kultepe-hattusa':
    'Kaneš merkezli kārum ticaret ağının Hattuš\'ta da bir istasyonu vardı; güzergâh Kültepe tabletlerinde belgelidir.',
  'cor-samal-karatepe':
    "Sam'al Amanosların doğu eteğini denetler; Karatepe ise dağların batısındaki Ceyhan vadisini. Koridor, aralarındaki dağ geçidi eksenidir.",
  'cor-karkamis-samal':
    'Demir Çağı kent devletleri coğrafyasında Fırat geçidini Amanos eteklerine bağlayan doğu-batı yolu.',
  // --- comparisons ---
  'cmp-gobekli-sayburc':
    'Sayburç yayını, kabartmanın leoparlarını, boğasını ve insan figürlerini Göbekli Tepe / Urfa bölgesi repertuvarıyla açıkça karşılaştırır.',
  'cmp-gobekli-catalhoyuk':
    'Neolitik araştırmalarında standart bir karşılaştırma çifti (toplu anıtlardaki yabani hayvan imgeleri ile ev bağlamları). Yalnızca karşılaştırmadır; yerleşimleri yüzyıllar ve 500 km ayırır.',
  'cmp-samal-karatepe':
    'İkisi de kabartmalı kapı yapılarını ve Fenikece kraliyet yazıtlarını (Kilamuwa; Azatiwada) öz temsil için kullanan küçük Demir Çağı devletleridir.',
  'cmp-karkamis-karatepe':
    'İki yerleşim de kabartmalı anıtsal Luvi hiyeroglif yazıtları taşır; Karatepe buna Fenikece çift dilliliği ekler.',
  'cmp-arslantepe-kultepe':
    'Yönetimden yazıya uzanan hat üzerinde karşılaştırma çifti (toplu mühürleme sistemleri ile tam çivi yazılı arşivler). Yerleşimler arasında doğrudan bağ iddia edilmez.',
  // --- concept edges: ritual ---
  'con-gobekli-tepe--ritual':
    'Toplu/ritüel toplanma yerleri olarak yorumlanan anıtsal yapılar (OUV metni).',
  'con-karahantepe--ritual': 'Dikilitaşlı ve heykelli, özel işlevli ana kayaya oyulmuş yapılar.',
  'con-sayburc--ritual': 'Kabartma, yerleşim içindeki toplu (özel) bir yapıyı süsler.',
  'con-catalhoyuk--ritual':
    'Evlerin içinde ritüel düzenlemeler (boğa başları, duvar resimleri, gömü uygulamaları).',
  'con-hattusa--ritual':
    'Kentteki tapınaklar ve tanrı alaylarıyla Yazılıkaya kaya tapınağı.',
  // --- body ---
  'con-gobekli-tepe--body':
    'Merkez dikilitaşlar kabartma kol, el ve kemer taşır (yorum düğümüne bakınız).',
  'con-karahantepe--body': 'İnsan heykelleri ve insan başı çıkmalı oda.',
  'con-sayburc--body': 'Kabartma sahnesinin baş kahramanları insan figürleridir.',
  'con-catalhoyuk--body':
    'Ev tabanlarının altında gömüler; kafatası alma ve sıvama uygulamaları.',
  // --- animal symbolism ---
  'con-gobekli-tepe--animal-symbolism':
    'T biçimli dikilitaşlar üzerinde yırtıcı ve yabani hayvan kabartmaları.',
  'con-karahantepe--animal-symbolism': 'Hayvan heykelleri ve kabartmaları (yılanlar, leoparlar, yırtıcı kuşlar).',
  'con-sayburc--animal-symbolism': 'Kabartmada insan figürlerini leoparlar ve bir boğa kuşatır.',
  'con-catalhoyuk--animal-symbolism': 'Boğa imgeleri (boğa başları, resimler) ve leopar kabartmaları.',
  'con-karkamis--animal-symbolism': 'Aslanlar, boğalar ve mitolojik yaratıklarla ortostat kabartmaları.',
  'con-samal--animal-symbolism': 'İç kalenin kapı aslanları ve ortostat hayvan kabartmaları.',
  'con-karatepe--animal-symbolism':
    'Yontulmuş kapı aslanları ve sfenksler; kapı yapılarındaki kabartma hayvan repertuvarı.',
  // --- writing ---
  'con-arslantepe--writing':
    'Toplu mühürleme yönetimi: yazıdan önce kayıt (yazı öncesi bürokrasi).',
  'con-kultepe--writing': 'On binlerce Eski Asur çivi yazılı tableti.',
  'con-hattusa--writing':
    'Devlet çivi yazısı arşivleri; mühürlerde ve anıtlarda hiyeroglif Luvice.',
  'con-karkamis--writing': 'Anıtsal Luvi hiyeroglif kamusal yazıtları.',
  'con-samal--writing':
    'Alfabetik kraliyet yazıtları (Kilamuwa, Panamuwa, Bar-Rakib grubu).',
  'con-karatepe--writing':
    'Uzun Azatiwada çift dilli yazıtı: Fenikece ve hiyeroglif Luvice.',
  // --- power ---
  'con-arslantepe--power':
    'Merkezî depolama ve yeniden dağıtımlı MÖ 4. binyıl saray kompleksi.',
  'con-hattusa--power':
    'İmparatorluk başkenti: surlar, tapınaklar, Büyükkale kraliyet iç kalesi.',
  'con-karkamis--power':
    'Önce naiplik merkezi, ardından Fırat\'ın önde gelen Demir Çağı kent devleti.',
  'con-samal--power':
    'Saray kompleksleri (bīt-ḫilāni) ve kraliyet stelleriyle surlu kraliyet kenti.',
  'con-karatepe--power':
    'Yerel bir hükümdarın icraatlarını kapılarda ilan ettiği sınır kalesi.',
  // --- trade ---
  'con-kultepe--trade':
    'Eski Asur tüccar kolonisi: kalay ve kumaş ticareti, sözleşmeler, ortaklıklar.',
  'con-arslantepe--trade':
    'Saray evresinin merkezî depolama ve yeniden dağıtım ekonomisi.',
  'con-karkamis--trade': 'Kentin zenginliği Fırat geçidinin denetimine bağlıdır.',
  // --- memory ---
  'con-catalhoyuk--memory':
    'Atalara ait gömülerin üzerinde, kuşaklar boyunca yerinde yeniden kurulan evler.',
  'con-gobekli-tepe--memory':
    'Yapılar bilinçli olarak dolduruldu — gömülen, belki de böylece hatırlanan anıtlar.',
  'con-samal--memory':
    'Kuttamuwa steli, ölen kişi için süregiden bir ölü ziyafeti kurar.',
  'con-hattusa--memory':
    'Yazılıkaya hanedan anmasıyla ilişkilendirilir (B Odası ve IV. Tudhaliya).',
  // --- multilingualism ---
  'con-samal--multilingualism':
    "Tek bir kraliyet külliyatında Fenikece, Sam'alca ve Aramice bir arada kullanılır.",
  'con-karatepe--multilingualism': 'Fenikece–Luvice çift dilli kamusal yazıt.',
  'con-kultepe--multilingualism':
    'Bir Anadolu kentinde Eski Asur arşivleri; en erken Hititçe kişi adları.',
  'con-hattusa--multilingualism':
    'Arşivler Hititçe, Luvice, Hattice, Hurrice, Akadca ve daha fazlasını korur.',
  // --- border kingdoms ---
  'con-samal--border-kingdoms':
    'Asur, Arami ve Luvi etki alanları arasında küçük bir krallık.',
  'con-karatepe--border-kingdoms':
    "Adana / Hiyawa Krallığı'nın Toroslara bakan sınır kalesi.",
  'con-karkamis--border-kingdoms':
    'Hatti\'nin çöküşünden sonra imparatorluk sınırındaki geçidi elinde tutan kent devleti.',
  // --- interpretation edges ---
  'int-gobekli-t-pillars':
    'Merkez dikilitaşlardaki kabartma kol/el/kemer kanıttır; "insan biçimli varlıklar" okumadır.',
  'int-karahan-t-pillars':
    'Göbekli Tepe okumasının Karahantepe dikilitaşlarına genişletilmesi; akla yatkındır ama atıf yapılan yayında bu yerleşim için söylenmemiştir.',
  'int-samal-kuttamuwa':
    'Stelin kendi metni ("bu stelde olan ruhum") okumayı temellendirir; teolojik kapsamı tartışmalıdır.',
  'int-sayburc-narrative': 'Kabartmanın ilk yayınında önerilen okumadır.',
}

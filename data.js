/* ============================================================
   data.js — Mālama Map の共通データ
   ------------------------------------------------------------
   このファイルは index.html / plants.html の両方から読み込まれる。
   データは2種類に分かれている：

   1. PLANTS    … 植物マスター（図鑑）。種の固定情報。
   2. SIGHTINGS … 目撃投稿。いつ・どこで・誰が見たか。
                  plantId で PLANTS とひも付く。

   ピンの色（緑＝在来 / 赤＝外来）は SIGHTINGS には持たせず、
   plantId から PLANTS.category を引いて決める（データの二重管理を防ぐ）。
   ============================================================ */

/* ---------- 1. 植物マスター（図鑑用・7種） ---------- */
const PLANTS = [
  {
    id: "ohia-lehua",
    scientificName: "Metrosideros polymorpha",
    hawaiianName: "ʻŌhiʻa Lehua",
    englishName: "Ohia",
    category: "native",            // "native"（在来） | "invasive"（外来）
    status: "watch",               // endangered | watch | stable | invasive
    statusLabel: "要注意（ROD・治療法なし）",
    isKeystone: true,              // キーストーン種か
    rodRisk: true,                 // ROD（Rapid ʻŌhiʻa Death）対象か
    emoji: "🌺",
    color: "#c1272d",              // 写真が読めない時のカード色
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Metrosideros_polymorpha.jpg/500px-Metrosideros_polymorpha.jpg",
    description:
      "ハワイの森林の約80%を構成するキーストーン種。溶岩流の跡に最初に根づく先駆種で、赤い花（Lehua）が象徴的。",
    culturalNote:
      "Lehua の花は火山の女神ペレと結びつき、花を摘むと雨が降るという言い伝えがある。ハワイの森の心臓とされる。"
  },
  {
    id: "koa",
    scientificName: "Acacia koa",
    hawaiianName: "Koa",
    englishName: "Koa",
    category: "native",
    status: "watch",
    statusLabel: "要注意（放牧・外来草の影響）",
    isKeystone: false,
    rodRisk: false,
    emoji: "🌳",
    color: "#6b4226",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Acacia_koa_study_7.jpg/500px-Acacia_koa_study_7.jpg",
    description:
      "ハワイ最大級の在来高木。三日月形の葉（実は葉柄が変形したもの）が特徴。良質な木材として知られる。",
    culturalNote:
      "古来カヌー（waʻa）やサーフボードの材料として珍重された。Koa は『勇敢な戦士』も意味する言葉。"
  },
  {
    id: "olapa",
    scientificName: "Cheirodendron trigynum",
    hawaiianName: "ʻŌlapa",
    englishName: "Olapa",
    category: "native",
    status: "stable",
    statusLabel: "安定",
    isKeystone: false,
    rodRisk: false,
    emoji: "🍃",
    color: "#2d6a4f",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Starr_040522-0024_Cheirodendron_trigynum.jpg/500px-Starr_040522-0024_Cheirodendron_trigynum.jpg",
    description:
      "湿った森に育つ在来樹。葉が風でひらひら揺れる様子が美しい。",
    culturalNote:
      "葉が風に揺れて踊るように見えることから、フラのダンサー（ʻōlapa）の語源とされる。"
  },
  {
    id: "amau",
    scientificName: "Sadleria cyatheoides",
    hawaiianName: "ʻAmaʻu",
    englishName: "Amau fern",
    category: "native",
    status: "stable",
    statusLabel: "安定（溶岩流の先駆け種）",
    isKeystone: false,
    rodRisk: false,
    emoji: "🌿",
    color: "#40916c",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Starr_081014-0250_Sadleria_cyatheoides.jpg/500px-Starr_081014-0250_Sadleria_cyatheoides.jpg",
    description:
      "新しい溶岩流の上にいち早く定着する在来シダ。新芽は鮮やかな赤色をしている。",
    culturalNote:
      "若葉の赤色からハワイ語の地名（例：ʻAmaʻu）にも使われる。森の再生を象徴する植物。"
  },
  {
    id: "loulu",
    scientificName: "Pritchardia spp.",
    hawaiianName: "Loulu",
    englishName: "Loulu palm",
    category: "native",
    status: "endangered",
    statusLabel: "絶滅危惧",
    isKeystone: false,
    rodRisk: false,
    emoji: "🌴",
    color: "#1b4332",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Pritchardia_flowers.jpg/500px-Pritchardia_flowers.jpg",
    description:
      "ハワイ固有のヤシの仲間。扇状の大きな葉を持つ。多くの種が絶滅の危機にある。",
    culturalNote:
      "葉は屋根葺きや帽子・うちわ作りに使われた。かつてハワイの低地林に広く茂っていた。"
  },
  {
    id: "strawberry-guava",
    scientificName: "Psidium cattleianum",
    hawaiianName: "Waiawī",
    englishName: "Strawberry Guava",
    category: "invasive",
    status: "invasive",
    statusLabel: "侵略的外来種",
    isKeystone: false,
    rodRisk: false,
    emoji: "🔴",
    color: "#8b0000",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Ara%C3%A7%C3%A1-rosa_%28do_tupi_aras%C3%A1%29%2C_Psidium_cattleyanum_02.jpg/500px-Ara%C3%A7%C3%A1-rosa_%28do_tupi_aras%C3%A1%29%2C_Psidium_cattleyanum_02.jpg",
    description:
      "南米原産。密集した藪を作り在来植物の光と水を奪う。ハワイで最も問題のある外来樹の一つ。",
    culturalNote:
      "果実は食用になるが、繁殖力が非常に強く在来林を急速に置き換えてしまう。"
  },
  {
    id: "miconia",
    scientificName: "Miconia calvescens",
    hawaiianName: "Miconia",
    englishName: "Miconia",
    category: "invasive",
    status: "invasive",
    statusLabel: "侵略的外来種（最重要警戒）",
    isKeystone: false,
    rodRisk: false,
    emoji: "⚫",
    color: "#4a044e",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Starr_Miconia_calvescens0.jpg/500px-Starr_Miconia_calvescens0.jpg",
    description:
      "中南米原産。大きな葉で森の地面を真っ暗にし、在来植物を枯らす。『紫の疫病』と呼ばれる。",
    culturalNote:
      "1本の木から大量の種を飛ばす。タヒチでは森林の大半を覆い尽くした前例があり、ハワイでも最優先で駆除されている。"
  },
  {
    id: "naupaka",
    scientificName: "Scaevola taccada",
    hawaiianName: "Naupaka Kahakai",
    englishName: "Beach Naupaka",
    category: "native",
    status: "stable",
    statusLabel: "安定（海岸の在来種）",
    isKeystone: false,
    rodRisk: false,
    emoji: "🌸",
    color: "#4a7c59",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Starr_010209-0286_Scaevola_taccada.jpg/500px-Starr_010209-0286_Scaevola_taccada.jpg",
    description:
      "海岸に育つ在来低木。花が半分しかないように見える「半分の花」が特徴。",
    culturalNote:
      "「山のナウパカと海のナウパカ」の悲恋伝説で知られ、花が半分なのは引き裂かれた恋人を表すという。"
  },
  {
    id: "ohelo",
    scientificName: "Vaccinium reticulatum",
    hawaiianName: "ʻŌhelo ʻAi",
    englishName: "Ohelo berry",
    category: "native",
    status: "stable",
    statusLabel: "安定（溶岩地・高地の固有種）",
    isKeystone: false,
    rodRisk: false,
    emoji: "🫐",
    color: "#a63a50",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Starr_011003-0146_Vaccinium_reticulatum.jpg/500px-Starr_011003-0146_Vaccinium_reticulatum.jpg",
    description:
      "溶岩地や高地に育つ在来の低木。赤い液果をつけるハワイ固有のツツジ科。",
    culturalNote:
      "実は火山の女神ペレに捧げられ、食べる前に一枝を火口に投げて敬意を示す習わしがある。"
  },
  {
    id: "mamane",
    scientificName: "Sophora chrysophylla",
    hawaiianName: "Māmane",
    englishName: "Mamane",
    category: "native",
    status: "stable",
    statusLabel: "在来（高地乾燥林・パリラの主食）",
    isKeystone: false,
    rodRisk: false,
    emoji: "🌼",
    color: "#b8860b",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Starr_030222-0062_Sophora_chrysophylla.jpg/500px-Starr_030222-0062_Sophora_chrysophylla.jpg",
    description:
      "高地の乾燥林に育つ在来木。黄色い花をつけるマメ科で、絶滅危惧の鳥パリラの主食。",
    culturalNote:
      "硬い材はソリ（hōlua）や道具に使われた。パリラはマメの未熟な種子と花に依存して生きる。"
  },
  {
    id: "hapuu",
    scientificName: "Cibotium glaucum",
    hawaiianName: "Hāpuʻu Pulu",
    englishName: "Hawaiian tree fern",
    category: "native",
    status: "stable",
    statusLabel: "安定（湿潤林の在来木生シダ）",
    isKeystone: false,
    rodRisk: false,
    emoji: "🪴",
    color: "#2f5d3a",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Cibotium_glaucum_-_Jardin_Botanique_de_Lyon_-_DSC05374.JPG/500px-Cibotium_glaucum_-_Jardin_Botanique_de_Lyon_-_DSC05374.JPG",
    description:
      "湿った森に育つ在来の木生シダ。若葉を包む柔らかい繊維「pulu」で知られる。",
    culturalNote:
      "pulu はかつて枕やマットレスの詰め物として採取・輸出された。森に水を蓄える役割も大きい。"
  },
  {
    id: "iliahi",
    scientificName: "Santalum freycinetianum",
    hawaiianName: "ʻIliahi",
    englishName: "Hawaiian sandalwood",
    category: "native",
    status: "watch",
    statusLabel: "要注意（白檀交易で乱伐の歴史）",
    isKeystone: false,
    rodRisk: false,
    emoji: "🪵",
    color: "#8a6d3b",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Starr_030222-0079_Santalum_freycinetianum_var._lanaiense.jpg/500px-Starr_030222-0079_Santalum_freycinetianum_var._lanaiense.jpg",
    description:
      "香りのある材を持つ在来の白檀。他の植物の根から養分を得る半寄生の木。",
    culturalNote:
      "19世紀初頭の白檀交易で大量に伐採され激減した。ハワイ史では『白檀の時代』とも呼ばれる。"
  },
  {
    id: "ilima",
    scientificName: "Sida fallax",
    hawaiianName: "ʻIlima",
    englishName: "Ilima",
    category: "native",
    status: "stable",
    statusLabel: "安定（海岸〜乾燥地の在来種）",
    isKeystone: false,
    rodRisk: false,
    emoji: "🏵️",
    color: "#e08e0b",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Starr_020112-0026_Sida_fallax.jpg/500px-Starr_020112-0026_Sida_fallax.jpg",
    description:
      "海岸から乾燥地まで広く育つ在来低木。オレンジ〜黄色の小さな花をつける。",
    culturalNote:
      "オアフ島を象徴する花。薄い花を何百も重ねて作るレイは、かつて王族に愛された。"
  },
  {
    id: "hala",
    scientificName: "Pandanus tectorius",
    hawaiianName: "Hala",
    englishName: "Screwpine (Hala)",
    category: "native",
    status: "stable",
    statusLabel: "安定（海岸近くの在来樹）",
    isKeystone: false,
    rodRisk: false,
    emoji: "🧺",
    color: "#3d6b35",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Pandanus_tectorius.jpg/500px-Pandanus_tectorius.jpg",
    description:
      "海岸近くに育つ在来樹。支柱根と、パイナップルに似た集合果が特徴。",
    culturalNote:
      "葉（lau hala）は帽子・マット・帆の伝統的な編み材。実は染料やレイにも使われる。"
  },
  {
    id: "fountain-grass",
    scientificName: "Cenchrus setaceus",
    hawaiianName: "—",
    englishName: "Fountain grass",
    category: "invasive",
    status: "invasive",
    statusLabel: "侵略的外来種（山火事リスク）",
    isKeystone: false,
    rodRisk: false,
    emoji: "🌾",
    color: "#9a7b4f",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Starr_040217-0077_Pennisetum_setaceum.jpg/500px-Starr_040217-0077_Pennisetum_setaceum.jpg",
    description:
      "アフリカ原産の観賞用イネ科。乾燥地に密生し、山火事を広げて在来植物を脅かす。",
    culturalNote:
      "燃えやすく火災を助長し、火事の後は自分が真っ先に再繁殖して在来種を締め出す悪循環を生む。"
  }
];

/* ---------- 2. 目撃投稿（地図ピン用・10件） ----------
   lat/lng はハワイ各島の実在地点付近に配置している。       */
const SIGHTINGS = [
  {
    id: "s001",
    plantId: "ohia-lehua",
    lat: 21.4145, lng: -157.7980,
    date: "2026-05-12",
    note: "Waikalua Loko Iʻa の遊歩道沿い。葉に黒ずみあり、ROD要観察。",
    reporter: "APIS Student",
    photoUrl: null
  },
  {
    id: "s002",
    plantId: "ohia-lehua",
    lat: 19.4290, lng: -155.2570,
    date: "2026-05-18",
    note: "ハワイ火山国立公園。健康な大木。周囲の若木も順調。",
    reporter: "Volunteer K.",
    photoUrl: null
  },
  {
    id: "s003",
    plantId: "koa",
    lat: 20.7150, lng: -156.2540,
    date: "2026-04-29",
    note: "Haleakalā 中腹の保全林。柵で放牧から守られているエリア。",
    reporter: "Ranger M.",
    photoUrl: null
  },
  {
    id: "s004",
    plantId: "olapa",
    lat: 22.1310, lng: -159.6620,
    date: "2026-05-02",
    note: "Kokeʻe の湿った尾根道。葉が風で揺れていた。",
    reporter: "Hiker A.",
    photoUrl: null
  },
  {
    id: "s005",
    plantId: "amau",
    lat: 19.4015, lng: -155.2840,
    date: "2026-05-20",
    note: "新しい溶岩流の上に赤い新芽。再生の最前線。",
    reporter: "APIS Student",
    photoUrl: null
  },
  {
    id: "s006",
    plantId: "loulu",
    lat: 21.3640, lng: -157.8000,
    date: "2026-04-15",
    note: "Lyon Arboretum 付近で保護株を確認。野生では希少。",
    reporter: "Botanist S.",
    photoUrl: null
  },
  {
    id: "s007",
    plantId: "strawberry-guava",
    lat: 21.3320, lng: -157.8010,
    date: "2026-05-08",
    note: "Mānoa の谷で密生。在来の若木が見当たらない。要駆除。",
    reporter: "Volunteer T.",
    photoUrl: null
  },
  {
    id: "s008",
    plantId: "miconia",
    lat: 20.8990, lng: -156.4060,
    date: "2026-05-11",
    note: "東マウイの林道沿いで1本発見。即報告・除去依頼済み。",
    reporter: "Ranger M.",
    photoUrl: null
  },
  {
    id: "s009",
    plantId: "ohia-lehua",
    lat: 21.4980, lng: -158.0150,
    date: "2026-06-01",
    note: "オアフ北部の尾根。今のところ ROD の兆候なし。",
    reporter: "Hiker A.",
    photoUrl: null
  },
  {
    id: "s010",
    plantId: "strawberry-guava",
    lat: 22.0750, lng: -159.3210,
    date: "2026-06-05",
    note: "カウアイ東部の登山口付近に新たな群落。拡大中。",
    reporter: "APIS Student",
    photoUrl: null
  }
];

/* ---------- 便利関数：plantId から植物マスターを引く ---------- */
function getPlantById(id) {
  return PLANTS.find(function (p) { return p.id === id; });
}

/* ============================================================
   ユーザー投稿の保存（フェーズ1：localStorage）
   ------------------------------------------------------------
   フェーズ2で Firebase Firestore に差し替える予定の部分。
   今はブラウザ内（localStorage）に保存するので、サーバー不要で
   投稿が消えずに地図へ反映される。
   ============================================================ */
const STORAGE_KEY = "malama_sightings";

// 保存済みのユーザー投稿を取り出す（壊れていたら空配列）
function getStoredSightings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

// 1件追加して保存
function saveSighting(sighting) {
  const list = getStoredSightings();
  list.push(sighting);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// サンプル投稿 ＋ ユーザー投稿 を合わせた全件
function getAllSightings() {
  return SIGHTINGS.concat(getStoredSightings());
}

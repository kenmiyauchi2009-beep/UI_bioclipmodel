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
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ohia%20lehua%20flower.jpg?width=480",
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
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Acacia%20koa.jpg?width=480",
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
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cheirodendron%20trigynum.jpg?width=480",
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
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Sadleria%20cyatheoides.jpg?width=480",
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
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Pritchardia%20hillebrandii.jpg?width=480",
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
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Psidium%20cattleianum%20fruit.jpg?width=480",
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
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Miconia%20calvescens%20leaves.jpg?width=480",
    description:
      "中南米原産。大きな葉で森の地面を真っ暗にし、在来植物を枯らす。『紫の疫病』と呼ばれる。",
    culturalNote:
      "1本の木から大量の種を飛ばす。タヒチでは森林の大半を覆い尽くした前例があり、ハワイでも最優先で駆除されている。"
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

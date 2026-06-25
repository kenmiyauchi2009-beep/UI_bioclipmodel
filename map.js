/* ============================================================
   map.js — Leaflet 地図のロジック
   ------------------------------------------------------------
   1. ハワイ諸島全体を表示
   2. SIGHTINGS をピンとして描画（緑＝在来 / 赤＝外来 / ROD は特別）
   3. 最新の目撃を右サイドのフィードに表示
   ============================================================ */

/* ---------- 1. 地図の初期化（ハワイ諸島全体） ---------- */
const map = L.map("map").setView([20.7, -157.0], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/* 未確認（plantId が "unknown" 等で植物が見つからない）投稿の代用データ */
const UNKNOWN_PLANT = {
  hawaiianName: "未確認 Unverified",
  scientificName: "コミュニティ判定待ち",
  category: "unknown",
  status: "watch",
  statusLabel: "未確認",
  emoji: "❓",
  rodRisk: false
};

/* ---------- 2. ピンのスタイルを決める ---------- */
// 在来＝緑 / 外来＝赤 / 未確認＝灰。ROD 対象種は白塗り＋赤縁で目立たせる。
function markerStyle(plant) {
  if (plant.rodRisk) {
    return { color: "#c1272d", fillColor: "#ffffff", fillOpacity: 1, weight: 4, radius: 9 };
  }
  if (plant.category === "invasive") {
    return { color: "#8b0000", fillColor: "#c1272d", fillOpacity: 0.9, weight: 2, radius: 8 };
  }
  if (plant.category === "unknown") {
    return { color: "#555", fillColor: "#9e9e9e", fillOpacity: 0.9, weight: 2, radius: 8 };
  }
  return { color: "#1b4332", fillColor: "#2d6a4f", fillOpacity: 0.9, weight: 2, radius: 8 };
}

// ポップアップの中身（クリックで出る吹き出し）
function popupHtml(plant, sighting) {
  const rodTag = plant.rodRisk
    ? '<span class="badge rod">ROD 要観察</span> '
    : "";
  const catLabel =
    plant.category === "native" ? "在来種 Native" :
    plant.category === "invasive" ? "外来種 Invasive" : "未確認 Unverified";
  // 写真があれば表示（ユーザー投稿）
  const photo = sighting.photoUrl
    ? '<img class="popup-photo" src="' + sighting.photoUrl + '" alt="投稿写真">'
    : "";
  return (
    '<div class="popup">' +
      '<div class="popup-title">' + plant.emoji + " " + plant.hawaiianName + "</div>" +
      '<div class="popup-sci">' + plant.scientificName + "</div>" +
      '<div style="margin:4px 0;">' + rodTag +
        '<span class="badge ' + plant.status + '">' + plant.statusLabel + "</span>" +
      "</div>" +
      photo +
      '<div class="popup-note">「' + sighting.note + "」</div>" +
      '<div class="popup-meta">' + catLabel + " ・ " + sighting.date +
        " ・ " + sighting.reporter + "</div>" +
    "</div>"
  );
}

/* ---------- 3. ピンを地図に描く ---------- */
// sighting.id → marker の対応表（フィードからクリックで飛べるように保持）
const markersById = {};

getAllSightings().forEach(function (s) {
  const plant = getPlantById(s.plantId) || UNKNOWN_PLANT; // 未確認は代用データ

  const marker = L.circleMarker([s.lat, s.lng], markerStyle(plant))
    .addTo(map)
    .bindPopup(popupHtml(plant, s));

  markersById[s.id] = marker;
});

/* ---------- 4. 最新の目撃フィード（右サイド） ---------- */
function renderFeed() {
  const feed = document.getElementById("feed");

  // 日付の新しい順に並べ替え（元配列は壊さない）
  const sorted = getAllSightings().slice().sort(function (a, b) {
    return a.date < b.date ? 1 : -1;
  });

  sorted.forEach(function (s) {
    const plant = getPlantById(s.plantId) || UNKNOWN_PLANT;

    const card = document.createElement("div");
    card.className = "feed-card" + (plant.category === "invasive" ? " invasive" : "");

    const photo = s.photoUrl
      ? '<img class="fc-photo" src="' + s.photoUrl + '" alt="投稿写真">'
      : "";

    card.innerHTML =
      '<div class="fc-head">' +
        '<span class="fc-emoji">' + plant.emoji + "</span>" +
        "<span>" +
          '<span class="fc-name">' + plant.hawaiianName + "</span><br>" +
          '<span class="fc-sci">' + plant.scientificName + "</span>" +
        "</span>" +
      "</div>" +
      photo +
      '<div class="fc-note">' + s.note + "</div>" +
      '<div class="fc-meta"><span>' + s.date + "</span><span>" + s.reporter + "</span></div>";

    // カードをクリック → 地図をそのピンへ移動してポップアップを開く
    card.addEventListener("click", function () {
      map.setView([s.lat, s.lng], 11, { animate: true });
      const m = markersById[s.id];
      if (m) m.openPopup();
    });

    feed.appendChild(card);
  });
}

renderFeed();

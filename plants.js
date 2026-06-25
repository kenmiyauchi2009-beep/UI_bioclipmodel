/* ============================================================
   plants.js — 植物図鑑のロジック
   ------------------------------------------------------------
   1. PLANTS からカードを生成
   2. 写真は Wikimedia の実写。読めなければ色＋絵文字に自動切替
      （onerror フォールバック）→ オフラインでも崩れない
   3. 在来 / 外来 でフィルタ
   ============================================================ */

const grid = document.getElementById("plantGrid");

/* ---------- 1枚のカードを作る ---------- */
function createCard(plant) {
  const card = document.createElement("article");
  card.className = "plant-card";
  card.dataset.category = plant.category;

  const catLabel = plant.category === "native" ? "在来種 Native" : "外来種 Invasive";

  // --- 写真部分（フォールバック付き） ---
  const photo = document.createElement("div");
  photo.className = "plant-photo";

  const img = document.createElement("img");
  img.src = plant.imageUrl;
  img.alt = plant.hawaiianName + "（" + plant.scientificName + "）";
  img.loading = "lazy";
  // 画像が読めなかったら、色＋絵文字の代用ブロックに差し替える
  img.onerror = function () {
    const fb = document.createElement("div");
    fb.className = "photo-fallback";
    fb.style.background = plant.color;
    fb.textContent = plant.emoji;
    img.replaceWith(fb);
  };
  photo.appendChild(img);

  const catTag = document.createElement("span");
  catTag.className = "cat-tag " + plant.category;
  catTag.textContent = catLabel;
  photo.appendChild(catTag);

  // --- 本文部分 ---
  const body = document.createElement("div");
  body.className = "plant-body";

  // タグ（ROD / キーストーン / 保全ステータス）
  let tags = '<span class="badge ' + plant.status + '">' + plant.statusLabel + "</span>";
  if (plant.rodRisk)    tags += ' <span class="badge rod">ROD 要観察</span>';
  if (plant.isKeystone) tags += ' <span class="badge keystone">キーストーン種</span>';

  body.innerHTML =
    '<div class="haw-name">' + plant.emoji + " " + plant.hawaiianName + "</div>" +
    '<div class="sci-name">' + plant.scientificName + "</div>" +
    '<div class="eng-name">English: ' + plant.englishName + "</div>" +
    '<div class="tag-row">' + tags + "</div>" +
    '<div class="desc">' + plant.description + "</div>" +
    '<div class="cultural"><strong>文化・豆知識:</strong> ' + plant.culturalNote + "</div>";

  card.appendChild(photo);
  card.appendChild(body);
  return card;
}

/* ---------- 全カードを描画 ---------- */
function renderCards(filter) {
  grid.innerHTML = "";
  PLANTS.forEach(function (plant) {
    if (filter === "all" || plant.category === filter) {
      grid.appendChild(createCard(plant));
    }
  });
}

/* ---------- フィルタボタン ---------- */
const filterBar = document.getElementById("filters");
filterBar.addEventListener("click", function (e) {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  // 見た目の active を切り替え
  filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  btn.classList.add("active");

  renderCards(btn.dataset.filter);
});

/* ---------- 初期表示 ---------- */
renderCards("all");

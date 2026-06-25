/* ============================================================
   report.js — 投稿フォームのロジック
   ------------------------------------------------------------
   ① 写真を撮る/選ぶ（縮小してプレビュー＆保存）
   ② 地図をタップして地点を選ぶ（ドラッグ微調整・GPS対応）
   ③ 植物名を選ぶ（未確認も選べる）
   ④ メモ・報告者名
   送信 → localStorage に保存 → ホーム地図へ
   ============================================================ */

/* ---------- ③ 植物セレクトを PLANTS から作る ---------- */
const plantSelect = document.getElementById("plantSelect");
PLANTS.forEach(function (p) {
  const opt = document.createElement("option");
  opt.value = p.id;
  const cat = p.category === "native" ? "在来" : "外来";
  opt.textContent = p.emoji + " " + p.hawaiianName + "（" + cat + "・" + p.scientificName + "）";
  plantSelect.appendChild(opt);
});
// 「未確認」= コミュニティ判定に回す
const unknownOpt = document.createElement("option");
unknownOpt.value = "unknown";
unknownOpt.textContent = "❓ 未確認（あとでみんなで判定）";
plantSelect.appendChild(unknownOpt);

/* ---------- ② 地点選択ミニマップ ---------- */
const pickMap = L.map("pickMap").setView([20.7, -157.0], 7);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(pickMap);

let chosen = null;       // { lat, lng }
let pickMarker = null;
const coordLabel = document.getElementById("coordLabel");

// 緯度経度をセットしてピンを置く（共通処理）
function setLocation(lat, lng) {
  chosen = { lat: lat, lng: lng };
  if (!pickMarker) {
    pickMarker = L.marker([lat, lng], { draggable: true }).addTo(pickMap);
    // ドラッグで微調整 → 座標を更新
    pickMarker.on("dragend", function () {
      const pos = pickMarker.getLatLng();
      chosen = { lat: pos.lat, lng: pos.lng };
      updateCoordLabel();
    });
  } else {
    pickMarker.setLatLng([lat, lng]);
  }
  updateCoordLabel();
}

function updateCoordLabel() {
  coordLabel.textContent =
    "選択済: " + chosen.lat.toFixed(4) + ", " + chosen.lng.toFixed(4);
  coordLabel.classList.add("set");
}

// 地図クリックで地点選択
pickMap.on("click", function (e) {
  setLocation(e.latlng.lat, e.latlng.lng);
});

// 現在地（GPS）ボタン
document.getElementById("useGps").addEventListener("click", function () {
  if (!navigator.geolocation) {
    alert("この端末では現在地を取得できません。地図をタップして選んでください。");
    return;
  }
  coordLabel.textContent = "現在地を取得中…";
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLocation(lat, lng);
      pickMap.setView([lat, lng], 13);
    },
    function () {
      coordLabel.textContent = "現在地の取得に失敗（地図をタップしてください）";
    }
  );
});

/* ---------- ① 写真：撮影/選択 → 縮小してプレビュー ---------- */
const photoInput = document.getElementById("photoInput");
const photoBox = document.getElementById("photoBox");
const placeholder = document.getElementById("photoPlaceholder");
const preview = document.getElementById("photoPreview");
const clearPhotoBtn = document.getElementById("clearPhoto");

let photoDataUrl = null;   // 保存用の縮小済み画像（data URL）

// プレースホルダ全体をタップでファイル選択を開く
photoBox.addEventListener("click", function () {
  photoInput.click();
});

photoInput.addEventListener("change", function () {
  const file = photoInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (ev) {
    // 画像を読み込んでから canvas で縮小（localStorage を圧迫しないため）
    const img = new Image();
    img.onload = function () {
      const MAX = 1000; // 長辺の最大ピクセル
      let w = img.width;
      let h = img.height;
      if (w > h && w > MAX) { h = h * (MAX / w); w = MAX; }
      else if (h > MAX)     { w = w * (MAX / h); h = MAX; }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);

      photoDataUrl = canvas.toDataURL("image/jpeg", 0.7); // 圧縮
      preview.src = photoDataUrl;
      preview.hidden = false;
      placeholder.hidden = true;
      clearPhotoBtn.hidden = false;

      // 縮小済み画像を BioCLIP に送って種を提案してもらう
      canvas.toBlob(function (blob) {
        classifyWithBioCLIP(blob);
      }, "image/jpeg", 0.7);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// 写真を消す
clearPhotoBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  photoDataUrl = null;
  photoInput.value = "";
  preview.hidden = true;
  preview.src = "";
  placeholder.hidden = false;
  clearPhotoBtn.hidden = true;
  aiResult.hidden = true;
  aiResult.innerHTML = "";
});

/* ============================================================
   BioCLIP AI 種提案（フェーズ3）
   ------------------------------------------------------------
   ローカルで動く BioCLIP API（http://localhost:8000）に写真を送り、
   返ってきた種候補を data.js の PLANTS と照合して
   「在来種 / 外来種 / 未確認」を提案する。
   ※ CLAUDE.md の3ステップ設計そのもの：
     Step1 BioCLIP で予測 → Step2 ハワイ種リストと照合
     → Step3 確信度が低ければ「未確認」でコミュニティ判定へ
   ============================================================ */
const API_BASE = "http://localhost:8000";
const aiResult = document.getElementById("aiResult");

// 予測の学名（"Metrosideros polymorpha"）を PLANTS と照合
function matchPlant(sciName) {
  if (!sciName) return null;
  const lower = sciName.toLowerCase();
  const genus = lower.split(" ")[0];
  // ① 学名フル一致
  let m = PLANTS.find(function (p) {
    return p.scientificName.toLowerCase() === lower;
  });
  if (m) return m;
  // ② 属名一致（"Pritchardia spp." のような属レベル登録に対応）
  return PLANTS.find(function (p) {
    return p.scientificName.toLowerCase().split(" ")[0] === genus;
  }) || null;
}

async function classifyWithBioCLIP(blob) {
  aiResult.hidden = false;
  aiResult.innerHTML = '<div class="ai-loading">🧠 BioCLIP が解析中…</div>';

  try {
    const fd = new FormData();
    fd.append("file", blob, "photo.jpg");
    fd.append("rank", "species");
    fd.append("top_k", "5");

    const res = await fetch(API_BASE + "/classify", { method: "POST", body: fd });
    if (!res.ok) throw new Error("status " + res.status);
    const data = await res.json();
    renderAiResult(data);
  } catch (err) {
    // サーバー未起動・CORS など → 手動選択にフォールバック
    aiResult.innerHTML =
      '<div class="ai-error">AI種提案は今は使えません（BioCLIPサーバー未起動の可能性）。' +
      "手動で植物名を選んでください。</div>";
  }
}

function renderAiResult(data) {
  const preds = data.predictions || [];
  if (!preds.length) {
    aiResult.innerHTML = '<div class="ai-error">候補が得られませんでした。</div>';
    return;
  }

  // Step2：リスト内で最初に一致した候補を「判定」に採用
  let matchedPlant = null;
  let matchedPred = null;
  for (let i = 0; i < preds.length; i++) {
    const m = matchPlant(preds[i].name);
    if (m) { matchedPlant = m; matchedPred = preds[i]; break; }
  }

  const top = preds[0];
  const topPct = Math.round(top.score * 100);

  // 判定見出し（在来/外来/未確認）
  let verdictHtml;
  if (matchedPlant) {
    const cat = matchedPlant.category === "native" ? "native" : "invasive";
    const catLabel = cat === "native" ? "在来種 Native" : "外来種 Invasive";
    verdictHtml =
      '<div class="ai-verdict ' + cat + '">' +
        matchedPlant.emoji + " AI判定：<strong>" + catLabel + "</strong> — " +
        matchedPlant.hawaiianName +
        '<span class="ai-score">確信度 ' + Math.round(matchedPred.score * 100) + "%</span>" +
      "</div>" +
      '<button type="button" class="ai-apply" data-plant="' + matchedPlant.id + '">' +
        "この種で入力する" +
      "</button>";
  } else {
    // Step3：リストにない → 未確認を推奨
    verdictHtml =
      '<div class="ai-verdict unknown">' +
        "❓ AI判定：図鑑リストにない種の可能性（" + top.name + "）<br>" +
        '<span class="ai-score">未確認として投稿し、コミュニティ判定に回せます</span>' +
      "</div>" +
      '<button type="button" class="ai-apply" data-plant="unknown">未確認で入力する</button>';
  }

  // 確信度が低いときの注意
  const lowNote = top.score < 0.1
    ? '<div class="ai-lownote">⚠️ 確信度が低めです。葉や花の特徴も現地で確認してください。</div>'
    : "";

  // 候補リスト（上位5件・スコアバー付き）
  let listHtml = '<div class="ai-list-title">BioCLIP 候補 Top ' + preds.length + "</div>";
  preds.forEach(function (p) {
    const pct = Math.round(p.score * 100);
    const m = matchPlant(p.name);
    const tag = m
      ? '<span class="ai-tag ' + m.category + '">' +
          (m.category === "native" ? "在来" : "外来") + "</span>"
      : "";
    const common = p.common_name ? " （" + p.common_name + "）" : "";
    listHtml +=
      '<div class="ai-row">' +
        '<div class="ai-row-name"><i>' + p.name + "</i>" + common + " " + tag + "</div>" +
        '<div class="ai-bar"><span style="width:' + Math.max(pct, 3) + '%"></span></div>' +
        '<div class="ai-pct">' + pct + "%</div>" +
      "</div>";
  });

  aiResult.innerHTML =
    '<div class="ai-head">🧠 BioCLIP 種提案</div>' +
    verdictHtml + lowNote + listHtml +
    '<div class="ai-foot">CVPR 2024 受賞モデル BioCLIP（ローカルGPUで推論）</div>';

  // 「この種で入力する」→ セレクトに反映
  const applyBtn = aiResult.querySelector(".ai-apply");
  if (applyBtn) {
    applyBtn.addEventListener("click", function () {
      plantSelect.value = applyBtn.dataset.plant;
      applyBtn.textContent = "✓ 入力しました";
      applyBtn.disabled = true;
    });
  }
}

/* ---------- 送信 ---------- */
const form = document.getElementById("reportForm");
const formError = document.getElementById("formError");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  formError.hidden = true;

  // 必須チェック：地点と植物名
  if (!chosen) {
    showError("地点が選ばれていません。地図をタップするか「現在地を使う」を押してください。");
    return;
  }
  if (!plantSelect.value) {
    showError("植物名を選んでください（分からなければ「未確認」でOK）。");
    return;
  }

  // 投稿オブジェクトを作成（SIGHTINGS と同じ形）
  const sighting = {
    id: "u" + new Date().getTime(),       // ユーザー投稿は "u" で始まる
    plantId: plantSelect.value,
    lat: chosen.lat,
    lng: chosen.lng,
    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    note: document.getElementById("noteInput").value.trim() || "（メモなし）",
    reporter: document.getElementById("reporterInput").value.trim() || "匿名",
    photoUrl: photoDataUrl   // 写真なしなら null
  };

  try {
    saveSighting(sighting);
  } catch (err) {
    // localStorage 容量オーバーなどの保険
    showError("保存に失敗しました。写真のサイズが大きすぎる可能性があります。");
    return;
  }

  // 完了 → ホーム地図へ
  alert("投稿しました！地図に反映されます 🌺");
  window.location.href = "index.html";
});

function showError(msg) {
  formError.textContent = msg;
  formError.hidden = false;
  formError.scrollIntoView({ behavior: "smooth", block: "center" });
}

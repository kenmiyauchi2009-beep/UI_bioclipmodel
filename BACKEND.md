# Mālama Map — バックエンド仕様書（フェーズ2 設計メモ）

フロント（バニラHTML/CSS/JS）は完成済み。この文書は、投稿の**共有・永続化**をするバックエンド（DB＋API＋写真ストレージ＋認証）を作る人向けの要件をまとめたもの。

> ⚠️ **AI判定（BioCLIP）はバックエンドに含めない。** GPUが必要なため、別途 **さくらのサーバー（さくらインターネット）** で動く独立サーバー。ここでは連携点だけ書く。

---

## 1. アーキテクチャ全体像

```
┌────────────────────────┐     ┌──────────────────────────────┐
│  フロント（静的サイト）   │     │  バックエンド（この文書の対象）   │
│  index/plants/report    │────▶│  ・DB（投稿・ユーザー・図鑑）      │
│  Leaflet / localStorage │     │  ・写真ストレージ                 │
│  → API に置き換える      │     │  ・認証（アカウント）             │
└────────────────────────┘     │  ・REST/SDK API                │
             │                  └──────────────────────────────┘
             │
             ▼  写真だけ別サーバーへ
┌────────────────────────────────────────┐
│  AI判定（BioCLIP・さくらのサーバー・GPU必須） │
│  現在: http://163.43.183.200:8000        │
│  （163.43.x.x = さくらインターネットのIP帯）  │
│  POST /classify → 種の候補（確信度つき）    │
└────────────────────────────────────────┘
```

**役割分担**
- フロント（静的）＝ GitHub Pages / Netlify / Cloudflare Pages（無料・HTTPS自動）
- バックエンド＝ DB＋Auth＋Storage＋API（後述のDB選定を参照）
- AI＝ **さくらのサーバー**（固定グローバルIPあり）。BioCLIPを常駐させ `api.ドメイン` で公開。**バックエンドとは別**

---

## 2. 現状のデータ構造（localStorage）＝ そのまま移行対象

フロントは今 `data.js` の3関数でデータを扱っている。**この3関数をAPI呼び出しに差し替えるだけ**で画面はほぼ不変。

```js
// data.js（現状・localStorage）
const STORAGE_KEY = "malama_sightings";
getStoredSightings()        // → 保存済み投稿の配列
saveSighting(sighting)      // → 1件追加保存
getAllSightings()           // → サンプル + ユーザー投稿の全件
getPlantById(id)            // → 図鑑マスターを id で引く
```

### 2-1. 投稿（Sighting）の形

サンプル投稿（`SIGHTINGS`）:
```json
{
  "plantId": "ohia-lehua",
  "lat": 21.4145,
  "lng": -157.7980,
  "date": "2026-05-12",
  "note": "遊歩道沿い。葉に黒ずみあり、ROD要観察。",
  "reporter": "APIS Student",
  "photoUrl": null
}
```

ユーザー投稿（`report.js` が作る・追加フィールドあり）:
```json
{
  "id": "u1717200000000",
  "plantId": "ohia-lehua",      // 図鑑にある種のとき。未確認/未知種は null
  "speciesName": "Metrosideros polymorpha",  // BioCLIPが返した学名
  "aiScore": 0.87,              // AIの確信度（0〜1）
  "lat": 21.41, "lng": -157.79,
  "date": "2026-06-01",
  "note": "...",
  "reporter": "匿名",
  "photoUrl": "data:image/jpeg;base64,..."   // 今はbase64。DB化でURLに変える
}
```

> 📌 **移行時の注意**：`photoUrl` は今 base64（重い）。バックエンドでは **写真をStorageに置き、URLだけDBに保存**する（Firestoreは1MB上限・Postgresでも肥大化するため）。

### 2-2. 図鑑マスター（Plant）の形

```json
{
  "id": "ohia-lehua",
  "scientificName": "Metrosideros polymorpha",
  "hawaiianName": "ʻŌhiʻa Lehua",
  "englishName": "Ohia",
  "category": "native",          // "native" | "invasive"
  "status": "watch",             // endangered | watch | stable | invasive
  "statusLabel": "要注意（ROD・治療法なし）",
  "isKeystone": true,
  "rodRisk": true,
  "color": "#c1272d",
  "imageUrl": "https://.../Metrosideros_polymorpha.jpg",
  "description": "...",
  "culturalNote": "..."          // ⚠️ 文化情報＝データ主権に配慮（後述）
}
```

現状15種。将来3,191種へ拡張予定（CLAUDE.md ⑤）だが、**図鑑マスターはコード同梱でも良い**（DB必須ではない）。DBに載せるべきは主に**投稿・ユーザー・検証**。

---

## 3. バックエンドが提供すべきAPI

最小構成（フェーズ2 MVP）。REST例で記載（SupabaseならSDK、Firebaseなら各SDKでも可）。

| 用途 | メソッド/例 | 置き換える現行関数 | 備考 |
|---|---|---|---|
| 投稿一覧の取得 | `GET /sightings` | `getAllSightings()` | 地図・図鑑・フィードが使う。件数増えたらページング/範囲絞り込み |
| 投稿の作成 | `POST /sightings` | `saveSighting()` | 認証必須にできる。写真はURL参照 |
| 写真アップロード | `POST /photos`（→URL返す） | （新規） | 圧縮済みJPEGを受けてStorageへ。返ったURLを投稿に入れる |
| 図鑑マスター取得 | `GET /plants`（任意） | `getPlantById()` | コード同梱でも可 |
| サインアップ/ログイン | Auth SDK | （新規） | 下記「認証」 |

**投稿作成リクエスト例**
```
POST /sightings
{ plantId, speciesName, aiScore, lat, lng, date, note, photoUrl }
→ サーバーが id / reporter(uid) / createdAt を付与
```

**フロント側の差し替えポイント**：`data.js` の `getAllSightings` / `saveSighting` を `async`（fetch）に変えるだけ。呼び出し側（map.js/plants.js/report.js）は `await` を足す程度で済む設計になっている。

---

## 4. データモデル（DBスキーマ案）

フェーズ2で必要なもの＋将来の拡張を見据えた形。**リレーショナル（Postgres）想定で書くが、Firestoreならコレクションに読み替え**。

### フェーズ2（MVP・今すぐ必要）

**users**
| 列 | 型 | 備考 |
|---|---|---|
| id (uid) | string PK | 認証プロバイダのUID |
| display_name | string | |
| created_at | timestamp | |
| reputation | int | 実績スコア（初期0・後述） |

**sightings**
| 列 | 型 | 備考 |
|---|---|---|
| id | string PK | |
| user_id | FK→users | 投稿者（匿名許可なら null 可） |
| plant_id | string nullable | 図鑑の種。未知/未確認は null |
| species_name | string | BioCLIPの学名 |
| ai_score | float | 0〜1 |
| lat, lng | float | ⚠️希少種は**座標ぼかし**（後述） |
| date | date | 目撃日 |
| note | text | |
| photo_url | string | Storageのフォトへの参照 |
| status | enum | `unconfirmed` / `confirmed` / `rejected`（コミュニティ検証用） |
| created_at | timestamp | |

### フェーズ3以降（データが貯まってから・CLAUDE.md ①③④⑦）

**verifications**（コミュニティ検証 ①）
`id, sighting_id FK, user_id FK, vote(agree/disagree/reclassify), created_at`
→ 一定数の agree で sightings.status を confirmed に。

**embeddings**（写真ベクトル few-shot ③）
`sighting_id FK, species_name, vector(float[])`
→ **Postgres なら pgvector**（`ORDER BY vector <-> query LIMIT k` でkNN）。Firestoreは不得意。
→ 規模的にはAIサーバー側の numpy ファイルでも可（CLAUDE.md ③）。

**wiki_edits / wiki_reviews**（実績アカウントのWiki説明 ④）
`id, plant_id FK, user_id FK, content, sources[], status(pending/approved/rejected), reviewed_by, created_at`
→ **AI一次審査**（Haiku 4.5 でトリアージ）＋文化情報は人間経路（CLAUDE.md ④）。

**（トレンド⑦）** 専用テーブル不要。sightings の date/plant_id を **SQLで集計**（月別カウント・在来/外来シェア）。Postgresが得意。

---

## 5. 写真ストレージ

- 受け取り：フロントは既に**圧縮済み（長辺1000px・JPEG 0.7）**の画像を持っている。base64 でなく Blob で送れる（`canvas.toBlob`）。
- 保存先：オブジェクトストレージ（Supabase Storage / Firebase Storage / Cloudflare R2 等）。
- DBには **URLだけ**入れる。
- 無料枠：写真1枚 約100〜300KB → 5GBで約2〜5万枚（デモ〜初期コミュニティは十分）。
- ⚠️ Firebase Storage は新規プロジェクトで **Blazeプラン（従量・要カード）** が必要な場合あり。無料枠内なら$0だが予算アラート推奨。

---

## 6. 認証・アカウント・レピュテーション

- **認証**：メール/Google などのソーシャルログイン（Supabase Auth / Firebase Auth、無料枠で十分）。
- **匿名投稿**を許すかは要判断（今は reporter 文字列＝匿名可）。フェーズ2は「ログイン推奨・匿名も可」から始めると移行が楽。
- **レピュテーション（実績）は"質"ベース**（投稿数の荒稼ぎ防止）。確認された同定・高評価を重く。信頼ユーザーは検証・Wikiが即反映（CLAUDE.md 背骨レイヤー）。
- **この認証＋実績レイヤーが、①コミュニティ検証／③few-shot／④Wiki を同時に解錠する土台**（CLAUDE.md「信頼レイヤー」）。

---

## 7. AIサーバー（BioCLIP）との連携

**バックエンドとは別サーバー（さくらのサーバー）。** フロントが直接叩く（または将来バックエンド経由でプロキシ）。

- エンドポイント（現在）：`http://163.43.183.200:8000`（さくらインターネットのIP帯・固定グローバルIP）
- `POST /classify`：写真（multipart）→ 種の候補
  ```json
  { "predictions": [
      { "name": "Metrosideros polymorpha", "common_name": "Ohia", "score": 0.87, "genus": "Metrosideros" },
      ...
  ]}
  ```
- `GET /health`：稼働確認
- 候補リスト：`hawaii_plants.csv`（3,191種・学名のみ）
- モデル：BioCLIP 2.5（`imageomics/bioclip-2.5-vith14`・ViT-H/14）

**③ few-shot連携（将来）**：確認済み投稿のベクトルを AIサーバーが保持（numpyファイル or pgvector）→ ゼロショットとブレンド。バックエンドは「確認済み写真＝どれか」を渡す役割。

---

## 8. 非機能要件（公開前に必須）

| 項目 | 内容 |
|---|---|
| **HTTPS / mixed content** | フロントがhttpsなら AIサーバーも https 必須（`http://163...` は混在ブロック）。さくらは固定グローバルIPがあるので、**独自ドメイン＋Let's Encrypt（Nginx等でリバースプロキシ）でHTTPS化**するのが素直（自己署名だと `ERR_CERT_AUTHORITY_INVALID` になる） |
| **CORS** | 今は `*`。公開時は**自ドメイン限定**に（フロントのオリジンだけ許可） |
| **APIキー／レート制限** | AIサーバー・書き込みAPIに付ける（乱用防止） |
| **座標ぼかし** | **希少種・絶滅危惧種は座標をぼかして保存/表示**（盗掘防止）。sightings に「ぼかし済みか」を持たせるか、表示時に丸める |
| **文化情報のデータ主権** | `culturalNote` や moʻolelo は**先住民データ主権に配慮**。自動スクレイプしない・実践者/長老の確認経路。AIモデレーションは「文化情報→人間へ」振り分けのみ |
| **報酬** | 現金は非推奨（盗掘誘導）。**換金不可のポイント**で。希少種は対象外 |

---

## 9. DB選定（未決・判断材料）

| | NoSQL（Firestore／Firebase） | PostgreSQL（Supabase） |
|---|---|---|
| MVP（投稿保存・共有） | ◎ 一番簡単・`saveSighting`差し替えだけ | ○ |
| リアルタイム同期 | ◎ | ○ |
| ⑦ 時系列トレンド（集計） | ✕ 苦手 | ◎ SQLで一発 |
| ① 共起・地理検索 | △ geohash要 | ◎ PostGIS |
| ③ 写真ベクトル kNN | △ | ◎ pgvector |
| ④ 実績/Wiki（関連） | △ JOIN苦手 | ◎ |
| 学習コスト | ◎ 低い | △ SQL要 |

→ **このアプリの差別化機能（⑦①③④）が全部Postgresの強み**。将来を見るなら **Supabase（PostgreSQL）推し**。ただしMVPだけならFirestoreが最速。**最終決定は未**（CLAUDE.md参照）。

---

## 10. 実装の段階

1. **フェーズ2 MVP**：Auth＋DB（sightings/users）＋Storage＋`GET/POST /sightings`。`data.js` の2関数を差し替え。写真をStorageへ。
2. **モバイル仕上げ＋PWA**（フィールドアプリなので早め）。
3. **フェーズ3**：コミュニティ検証① → few-shot③ → Wiki④ → トレンド⑦（データが貯まってから）。

---

## 付録：フロント側で差し替える最小箇所

```
data.js:
  getAllSightings()  → GET /sightings（async化）
  saveSighting()     → POST /sightings ＋ 写真は POST /photos（async化）
report.js:
  photoDataUrl(base64) → Blobアップロード → 返URLを投稿へ
  reporter 入力       → ログインユーザーの uid / display_name に
```

呼び出し側（map.js / plants.js / report.js）は `await` を足す程度で画面ロジックはほぼそのまま使える設計になっている。

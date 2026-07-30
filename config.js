/* ============================================================
   config.js — フロントの接続設定（全ページで最初に読み込む）
   ------------------------------------------------------------
   ・MALAMA_API_BASE      … バックエンド Worker の URL
   ・MALAMA_SUPABASE_URL  … Supabase プロジェクト URL
   ・MALAMA_SUPABASE_ANON_KEY … publishable / anon キー（公開して安全）
   ※ anon キーはブラウザに出しても問題ない。書き込みは RLS で保護される。
   ============================================================ */

// 開発：ローカルの `wrangler dev`（http://localhost:8787）
// 本番：デプロイした Worker の URL に差し替える
window.MALAMA_API_BASE = "http://localhost:8787";

window.MALAMA_SUPABASE_URL = "https://kykuculompxyzpwnykbl.supabase.co";
window.MALAMA_SUPABASE_ANON_KEY = "sb_publishable_1uKPKqd-GuBdxexcpztpXA_HaymAdaV";

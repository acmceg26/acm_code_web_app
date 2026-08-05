// ─── Google Sheets content sources ──────────────────────────────────────────
// Each list can be driven by a published Google Sheet (CSV), so content can be
// updated by editing the sheet — no code change, no redeploy.
//
// To wire up the DSA sheet:
//   1. Put the questions in a Google Sheet with columns:
//        Topic | ID | Title | Difficulty | LeetCode | GFG | Video
//      (import `dsa_seed.csv` from this repo to start with the current data).
//      ID is OPTIONAL — leave it blank for new rows and the app derives a
//      stable id from the problem link. Keep existing IDs as-is so progress
//      that already references them stays intact.
//   2. File → Share → Publish to web → choose the sheet's tab → CSV → Publish.
//   3. Paste the resulting URL below (looks like
//      https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=0&single=true&output=csv ).
//
// Leave empty to use only the bundled JSON.
export const DSA_SHEET_CSV_URL = '';

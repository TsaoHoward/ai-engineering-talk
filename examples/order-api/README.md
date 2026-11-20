# Synthetic Order API — 單一案例入口

本專案只有一份需要持續維護的合成 Order API 原始碼：

**[TypeScript / MSW / Drizzle 版本](ts-v1/README.md)**，位於 `examples/order-api/ts-v1/`。

- 實際的 AI-direct、Project-convention、既有 Consumer、Schema、Fixtures、測試都集中在 `ts-v1/`。
- GitHub Pages 靜態環境使用 Browser MSW 攔截 API 及 DB 查詢；DB Mock 只支援 Order API 需要的有限 SQL，會依 42 筆固定資料運算。
- 兩邊均保留可執行的查詢與分頁功能，但故意呈現不同的分層與 Response 契約；這是**原創合成的對照**，不宣稱由真實 AI 模型生成。
- 案例需求與行為的唯一參考為 `ts-v1/src/` + `ts-v1/fixtures/`，驗收證據由 `ts-v1/test/browser.test.mjs` 生成。
- 舊 Java/JDBC/MyBatis **展示片段**及 Node/SQLite 雙軌實作不再維護；歷史可由 Git 查閱。不要在投影片重新複製或編修第二份程式碼。

目前正式 Slidev 內容仍有 Java/MyBatis 語詞，屬後續簡報整合需同步的展示內容，**不是另一份案例契約**。整合時應引用 `ts-v1/` 的程式與測試產物。

開發／驗收：
```sh
cd examples/order-api/ts-v1
npm ci
npm run verify
```

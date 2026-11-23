# Synthetic Order API — 案例入口

主案例僅維護一份可執行的 [TypeScript／MSW／Drizzle 實作](ts-v1/README.md)（`ts-v1/`）。

- 兩條路徑都能完成訂單狀態、UTC 日期區間與分頁查詢，正常回應使用相同的 `{code,message,data:{items,totalCount}}` 契約。
- 主衝突是錯誤訊息契約：既有專案的 `message` 存前端可查表的代碼（如 `m0001`），AI-direct 則將錯誤文字直接放進欄位；前端 Consumer 可以重現相容性差異。
- `OrderRepository`／SQL 與 `OrderService → OrderDao → Drizzle` 的分層差異用於第二章模組設計，不再製造第二個 Response 形狀衝突。
- 程式、固定 Fixture 與 Chromium 測試同處 `ts-v1/`；Browser MSW 同時模擬 API 與受限 SQL DB Handler。這是原創合成案例，不是特定模型的輸出。
- [全場 18 個單元的素材需求與案例範圍](../../docs/order-api-case-scope.md) 已固定。未完成的 Skill／Workflow／Vue 部署故事各自取材，不為此擴充 Order API。

```sh
cd examples/order-api/ts-v1
npm ci
npm run verify
```

正式投影片仍需按新版分鏡整合；不要從舊的 Response 形狀比較頁面複製內容。

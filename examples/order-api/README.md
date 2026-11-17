# Synthetic Order API

這是為簡報製作的合成 Java Spring Boot 案例，沒有引用公司程式或外部專案素材。程式片段只用來討論需求與工程契約，不構成完整可執行的 Spring Boot 專案。

## 案例需求

新增 `GET /api/orders`，可選擇依訂單狀態與建立日期區間篩選，並分頁回傳訂單。兩種實作都遵守以下相同的功能語意：

- `status` 可省略；提供時依原值完全比對。
- `fromDate`、`toDate` 必須同時提供或同時省略；提供時是含首尾日期的 UTC 日曆日期區間，且 `fromDate <= toDate`。資料庫的 `created_at` 儲存 UTC 時間戳；查詢轉成 `created_at >= fromDate 00:00` 且 `< toDate 次日 00:00`。片段將 JDBC／MyBatis 傳遞的 `LocalDateTime` 視為 UTC 時鐘值、不做隱式時區轉換；實際環境須確保資料庫欄位和連線時區符合此假設。
- `page` 從 0 起算，預設 `0`；`pageSize` 預設 `20`，可用範圍為 `1–100`。越界參數或不完整／反向日期區間回應 HTTP 400。
- 結果依 `created_at DESC, id DESC` 排序，確保同一時間戳的資料也有穩定順序。`totalCount` 是套用篩選條件後、套用分頁前的總筆數。
- 假設資料表為 `orders(id, customer_id, status, created_at)`。

## 虛構專案的既有契約

| 面向 | 慣例 |
| --- | --- |
| Naming | package 為 `com.example.order.{controller,service,dao,dto}`；使用 `OrderController`、`OrderService`、`OrderDao`、`OrderQueryDto`；DAO 回傳列用 `OrderItemDto`，分頁資料用 `OrderPageDto`。不以 `Repository` 命名 DAO。 |
| 分層 | Controller 處理 HTTP 輸入／輸出；Service 驗證並編排查詢；DAO 宣告資料操作；SQL 放在對應的 MyBatis XML。Service 不直接操作 JDBC。 |
| MyBatis | Mapper 介面和 XML namespace 對應；使用 `#{...}` 綁定值，不串接使用者輸入。 |
| 共用 API 回應 | `ApiResponse<T>` 固定為 `{ code, message, data }`，由共用工廠建立；新增欄位須另行做相容性設計，單一功能不得直接改外殼。 |
| 分頁回應 | 分頁資訊放在 `data` 內：`{ items, totalCount }`，因此共用外殼仍保持不變。 |

## 對照片段

- [AI 直接實作](ai-direct.md)：查詢與分頁意圖正確，且 SQL 使用參數綁定；但查詢元件直接操作 `NamedParameterJdbcTemplate`、沒有既定 Service／DAO／XML 邊界，並為此 API 擴充共用 `ApiResponse`。
- [符合專案慣例的實作](project-convention.md)：同一組篩選、日期和分頁規則，沿用 DTO 命名、Controller／Service／DAO／MyBatis XML 分層，以及固定的回應外殼。

### 對照要傳達的工程問題

1. **Naming 與責任邊界**：功能結果正確不代表元件名稱及責任符合此專案的詞彙和分工；新同事讀到 `Repository` 或 JDBC 查詢時，會預期另一套架構。
2. **既有分層與持續性**：直寫 JDBC 本身並非錯誤，但在這個案例中繞過 MyBatis XML 慣例，會讓查詢難以沿用既有 mapper 維護方式。
3. **共用契約與相容性**：將 `totalCount` 加到共用型別會擴大所有端點共用的契約；若序列化設定包含 null，既有端點的 JSON 也會多出 `totalCount: null`。將分頁資料放在 `data` 可維持共用契約。
4. **驗收範圍**：同一份輸入／輸出語意讓 Review 能聚焦於架構、命名與契約，而非以不同需求或錯誤邏輯造成表面差異。

# C1b-E1 — Space Requirement Measurement

本紀錄只量測 `b5b8d9b` 的 [`factored.svg`](./relationship-integration/factored.svg) 中兩個 Response message 區塊的內容，不包含共同 API envelope、Consumer、catalog 或完整投影片構圖。

## 量測條件

- 使用 Chromium + Playwright 實際渲染，viewport 為 `640 × 900`、device scale factor 為 `1`。
- 每個 Response 使用獨立的 auto-height container；外部寬度依序為 `320px`、`480px`、`640px`。
- `box-sizing: border-box`；container 內距為 `24px`，元素垂直間距為 `8px`。本輪未把來源 SVG 的描邊計入內容空間；因此可用內容寬度為外部寬度減 `48px`。
- identity：`24px`、粗體、`line-height: 29px`。
- message 語意標籤：`20px`、一般字重、`line-height: 24px`。
- message 值：`24px`、`line-height: 29px`；AI-direct 沿用來源 `.value-mono` 的一般字重，Project-convention 沿用來源 `.value-large` 的粗體。
- identity 與語意標籤沿用來源 SVG 的 sans-serif stack：`"Noto Sans CJK TC", "Noto Sans TC", Arial, Helvetica, sans-serif`。
- message 值沿用來源 SVG 的 monospace stack：`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`。
- 文字使用一般單字換行：`white-space: normal`、`overflow-wrap: normal`、`word-break: normal`；沒有縮小字級、截斷或省略號。
- `document.fonts` 狀態為 `loaded`，但平台字體檢查顯示本次環境沒有實際使用 Noto 字體：sans-serif 實際渲染為 `DejaVu Sans`，monospace 實際渲染為 `DejaVu Sans Mono`。以下結果以這次 Chromium fallback 的實際字形寬度為準。
- 高度是實際 container bounding box，高度未設上限；計算包含上下各 `24px` 內距、兩個 `8px` gap，以及 identity、label、value 的實際行高。

## 取用的內容

| Response | identity | message 語意標籤 | 完整 message 值 |
| --- | --- | --- | --- |
| AI-direct | `AI-direct response` | `message · raw error detail` | `fromDate and toDate must be supplied together` |
| Project-convention | `Project-convention response` | `message · message catalog key` | `m0001` |

## 實際量測結果

### AI-direct response

| 外部寬度 | 可用內容寬度 | message 行數 | identity 行數 | 語意標籤行數 | 完整區塊高度 | 水平溢出／遮擋／裁切 |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `320px` | `272px` | 3 | 1 | 1 | `204px` | 無 |
| `480px` | `432px` | 2 | 1 | 1 | `175px` | 無 |
| `640px` | `592px` | 2 | 1 | 1 | `175px` | 無 |

### Project-convention response

| 外部寬度 | 可用內容寬度 | message 行數 | identity 行數 | 語意標籤行數 | 完整區塊高度 | 水平溢出／遮擋／裁切 |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `320px` | `272px` | 1 | 2 | 2 | `199px` | 無 |
| `480px` | `432px` | 1 | 1 | 1 | `146px` | 無 |
| `640px` | `592px` | 1 | 1 | 1 | `146px` | 無 |

量測時所有文字 line rect 都落在 container 的可用內容範圍內；各文字元素的 `scrollWidth` 等於 `clientWidth`，沒有觀察到水平溢出。container 沒有固定高度或 clipping，因此也沒有垂直裁切；元素之間保留指定的 `8px` 垂直間距，沒有互相遮擋。

## 尺寸組合可行性

在本輪「auto-height、沒有外部高度上限」的條件下，六個 Response × 寬度組合都能完整渲染，沒有水平溢出、遮擋或裁切。

可直接由量測確認的差異是：

- `320px`：AI-direct 的 message 為 3 行；Project-convention 的 identity 與語意標籤各為 2 行，因此兩個完整區塊都比其他寬度下更高。
- `480px`：AI-direct 的 message 仍為 2 行；Project-convention 三個文字元素均為 1 行。
- `640px`：AI-direct 的 message 仍為 2 行；在本字體 fallback 與本字級下，增加的可用寬度尚不足以讓完整 raw message 成為 1 行。

「可行」在此僅表示完整內容能在該寬度自動增高後渲染；本紀錄不選擇最佳尺寸，也不判定兩個 Response 的排列方向。

## 仍需設計判斷的事項

- 簡報實際使用的瀏覽器、作業系統與字體是否與本次 Chromium fallback 相同；字體替換會改變換行與高度。
- 投影片可分配給這兩個區塊的實際高度，以及是否接受 `320px` 下的多行 identity／label；本輪沒有量測完整投影片或設定高度上限。
- 兩個 Response 的排列方向、相對寬度、是否需要對齊高度，以及它們和其他圖形的空間關係。
- `480px` 與 `640px` 的高度差異是否值得換取較寬的可讀行長；這是版面與敘事取捨，不是本次量測可直接決定的結果。

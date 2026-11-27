# D01

## Question

兩個 Response 的主要比較方向應採用哪一種？

## Selected Option

B

## Rationale

- `AI-direct` 的完整 raw text（`fromDate and toDate must be supplied together`）明顯長於 `m0001`；上下兩列可提供較完整的橫向空間，避免左右欄壓縮長文字。
- 每列固定對應一個 Response，lookup 結果可沿同一列向右延伸，直接保留 message 與其 catalog hit／miss、Consumer outcome 的一對一關係。
- `1600×900` 是寬畫布；將比較關係橫向展開，較適合容納完整訊息與後續結果鏈。

## Constraint

後續構造必須採用上下兩列比較，並讓各列的後續處理路徑向右延伸。

# D02

## Question

如何表示兩個 message 都接受同一 Consumer lookup？

## Selected Option

B

## Rationale

- 單一 Consumer／Lookup 區域與共用操作標籤，最清楚表示兩個 message 使用相同的處理機制。
- 沿 D01 的上下兩列保留兩條獨立路徑，可維持每個輸入與各自結果的一對一關係，不暗示輸入被合併。
- 不重複繪製 Lookup 標記，避免不必要的圖形重複，也不會暗示存在兩套 Consumer 或查表規則。

## Constraint

後續構造必須以單一 Consumer／Lookup 區域及一個共用操作標籤表示相同機制；兩條列路徑須在該區域保持分離並各自向右延伸，不得合併，也不得重複繪製 Lookup 標記。

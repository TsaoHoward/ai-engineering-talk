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

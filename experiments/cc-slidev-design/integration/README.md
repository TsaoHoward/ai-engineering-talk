# Slide 6 C2｜Slide Integration

這是獨立的完整揭露靜態 State 原型，不會被正式簡報入口引用，也不會修改上一輪 `slides.md`、Excalidraw 來源或正式 Slidev。

## 來源與整合決策

- 核准 headline：`既有契約也藏在命名與責任分層`。
- 構圖／資訊關係來源：[`../diagram/slide-6-candidate-d.excalidraw`](../diagram/slide-6-candidate-d.excalidraw) 與 [`../diagram/slide-6-candidate-d.svg`](../diagram/slide-6-candidate-d.svg)。
- 使用兩個獨立 variant frame；每個 frame 各自包含 `Controller`，沒有畫成單一 Controller 分流。
- 以 CSS/HTML 重建責任鏈，將 Excalidraw 的空間關係轉成適合 1600×900 投影片的字級與節奏；未把 SVG 當成投影片圖片依賴。
- 底部保留共同合成執行基礎：`DbTransport` → `Browser MSW POST /mock/db/query` → `bounded SQL evaluator` → `fixtures/orders.json`。

## Reproduce

```bash
cd experiments/cc-slidev-design/integration
../../../node_modules/.bin/slidev slides.md
```

PNG 預覽：[`exports/slide-6-c2-static.png`](./exports/slide-6-c2-static.png)。

本輪只做基本渲染與畫面檢查，不執行完整品質驗收、Reveal 或 Slide Integration 以外的正式簡報工作。

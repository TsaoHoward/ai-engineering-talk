# C2-R｜原生 Diagram Integration

這是獨立的最小 Slidev 原型，用 Slidev 原生 `two-cols` layout、既有 `default` theme、Markdown 標題與 Markdown 圖片引用，直接呈現既有的 Excalidraw SVG。它不修改既有 C2 原型、正式簡報、Slide Copy、Excalidraw source 或 SVG。

## 來源

- Headline：`既有契約也藏在命名與責任分層`（`docs/slide-copy.md` Slide 6）。
- Diagram：[`../diagram/slide-6-candidate-d.svg`](../diagram/slide-6-candidate-d.svg)。
- Upstream rule：cc-slidev revision `99fdefe12c835f85907e801f5f0167c138971cd5` 的 `slidev/commands/diagram.md`；Excalidraw 只以已渲染 SVG 引用，不嵌入 JSON。

## 重現

不安裝依賴，使用專案既有的 Slidev、Vite 與 Playwright：

```bash
cd experiments/cc-slidev-design/native-integration
../../../node_modules/.bin/slidev build slides.md \
  --out /tmp/cc-slidev-native-integration-build \
  --without-notes

cd /home/howard/workspace/ai-engineering-talk
node_modules/.bin/vite preview \
  --host 127.0.0.1 \
  --port 3098 \
  --strictPort \
  --outDir /tmp/cc-slidev-native-integration-build
```

另一個 terminal 擷取 1600×900 PNG：

```bash
cd /home/howard/workspace/ai-engineering-talk
node_modules/.bin/playwright screenshot \
  --browser chromium \
  --viewport-size '1600,900' \
  --wait-for-selector 'img[alt="Slide 6 Candidate D diagram"]' \
  --wait-for-timeout 500 \
  http://127.0.0.1:3098/#/1 \
  experiments/cc-slidev-design/native-integration/exports/slide-6-native-integration.png
```

交付 PNG：[`exports/slide-6-native-integration.png`](./exports/slide-6-native-integration.png)。

## 驗證與限制

- PNG 尺寸：`1600 × 900`。
- 靜態預覽中的 Slidev canvas：`1600 × 900`。
- SVG 載入尺寸：約 `744 × 372`；沒有水平或垂直溢出。
- 原生 `two-cols` 將 SVG 限制在右側欄位，造成圖中文字偏小、左側留白較多；這是本輪要保留的原生整合結果。
- 原始 SVG 的 `viewBox`、內容與尺寸沒有被重繪或修改；沒有新增 HTML、CSS 或 Vue component。
- 由於 SVG 位於 prototype 目錄之外，直接以 `slidev slides.md` 開發伺服器預覽時，Vite 可能將相對路徑回退到 index；上述 build + static preview 是本輪可重現的驗證路徑。

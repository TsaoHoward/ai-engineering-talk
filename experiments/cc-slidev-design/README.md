# cc-slidev Slide 6 design experiment

這是獨立的 Slide 6 視覺實驗，不會被正式簡報入口引用，也不會修改既有 Slide Copy、案例 SSOT 或正式投影片。

## Preview

三個 State 依序代表：

1. 先比較兩條都能成立的實作路徑。
2. 揭示兩條路徑共享的 Browser MSW 執行鐵軌。
3. 收束到「交付相容性」的核心訊息。

可直接查看：

- [State 0 PNG](./exports/slide-6-state-0.png)
- [State 1 PNG](./exports/slide-6-state-1.png)
- [State 2 PNG](./exports/slide-6-state-2.png)
- [靜態 Preview](./preview/index.html)

## Reproduce

```bash
cd experiments/cc-slidev-design
../../node_modules/.bin/slidev slides.md
```

開啟 `/1`、`/2`、`/3` 依序觀看三個 State。`preview/` 是用同一份 `slides.md` 建出的靜態輸出；PNG 使用專案既有 Playwright 執行器擷取為 1600×900。

## Sources

- `slides.md`：原型來源與 State 編排。
- `styles/index.css`：實驗專用視覺樣式。
- `../../components/ArchitectureLayers.vue`：重用的既有元件，未修改。
- [`review.md`](./review.md)：Skill 相容性、設計決策與驗收紀錄。

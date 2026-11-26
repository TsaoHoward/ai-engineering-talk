# Method Evaluation — Experiment Retrospective

## Experiment Summary

本實驗從 Explore 延伸至 Develop R1、S04 的 D1–D3.4a，最後停在 commit [`d8d7694`](https://github.com/TsaoHoward/ai-engineering-talk/commit/d8d7694f76a6ceffe530c88630f296c1bc03a873)。它處理的是「如何把執行結果、既有 Consumer 契約與證據邊界組成可理解的視覺敘事」，不是正式簡報的實作或 runtime 驗證。

目前產物支持的是靜態視覺設計判斷與產物一致性判斷；沒有觀眾、投影、Slidev/runtime 或 D4 證據，也沒有執行時間或 token 用量紀錄。因此本回顧不宣稱整體方法有效或改善效率。

下文使用三種判讀：**產物證據**＝可由檔案、畫面或 commit 直接核對；**合理推論**＝由多個產物的差異推得、但未經觀眾測試；**待驗證**＝現有實驗沒有回答。

## Method Findings

| 任務 | 實際處理的設計問題 | 輸入 → 輸出 → 下游用途 | 目前可支持的發現 |
| --- | --- | --- | --- |
| Explore concept comparison | 尚未決定觀眾要採用「追蹤案例」「接合契約」或「證據判斷」哪一種理解模型。 | PR #20 基準與案例限制 → A/B/C 三個低精度概念及取捨 → 提供主敘事選擇與風險 guard；見 [`concept-board.md`](./concept-board.md) 與 [`b61f7be`](https://github.com/TsaoHoward/ai-engineering-talk/commit/b61f7bec0c452ba699088b04361e029b9cf7d7a8)。 | **產物證據：** 概念比較確實把差異放在理解模型，而非只換顏色或版型。**合理推論：** 這有助於及早暴露「箭頭會被讀成 runtime trace」及「證據會變成報告」等語意風險；沒有證明哪一概念對觀眾最好。 |
| Develop R1 storyboard | 把選定的敘事方向落成可觀看的順序，同時保持同一案例、成功 checkpoint、message mismatch 與 source guard。 | Concept A 與歷史 revision → 6 個 snapshot、視覺語言與形成性 critique → 作為 S04／正式投影片敘事的 staging；見 [`design-storyboard.md`](./develop/design-storyboard.md)、[`04-message.png`](./develop/png/04-message.png) 與 [`8ce245c`](https://github.com/TsaoHoward/ai-engineering-talk/commit/8ce245c7eed48cd6a7f411197e9ce0b90542f0ff)。 | **產物證據：** 同一查詢卡、先 success 後 message、以及 `historical revision / not rerun` guard 都被明確化。**限制：** Develop 選了 A，而 Explore 原本推薦 C；這是設計決策紀錄，不是概念優劣的受控比較。 |
| D1 semantic model | 防止把 `HTTP 400`、`message` 語意、Consumer compatibility 與 API success/failure 混成同一件事。 | R1 的 S04 案例與指定 source revision → objects、attributes、relations、invariants、differences、semantic constraints；見 [`semantic-model.md`](./studies/s04/semantic-model.md) 與 [`2c26acf`](https://github.com/TsaoHoward/ai-engineering-talk/commit/2c26acf66e788f1adb8ae8fedfc165afe97263d8)。 | **產物證據：** 後續 Composition 與 Sequence 都能沿用同一 invalid request、共同 envelope、兩個 response 及兩條 lookup lane。**合理推論：** 對語意密度高的技術畫面，先把 invariant 與 difference 外顯，較能降低圖形簡化時的語意漂移；本實驗沒有比較「有／無 semantic model」的結果。 |
| D1 visual construction / Factoring / Subtraction | 將語意模型轉成圖形，並測試「重複是否可抽取」與「哪些元素不能刪」。 | Semantic model → Graphic Construction、V2 Factoring、V3 Subtraction → Graphic Review 選定後續基礎；見 [`graphic-construction.png`](./studies/s04/graphic-construction.png)、[`form-factoring.png`](./studies/s04/form-factoring.png)、[`form-subtraction.png`](./studies/s04/form-subtraction.png)、[`graphic-review.md`](./studies/s04/graphic-review.md)。 | **產物證據：** V2 移除共同欄位重複但保留 `message → catalog → outcome`；V3 更簡潔卻失去 lookup 操作及共同欄位從屬關係，因此不宜直接使用。這支持「Factoring 可作選用操作」，也支持「Subtraction 必須以關係是否仍可見來判斷」，不支持單純以更少元素判定更好。 |
| D2 Massing / Value / Rough Composition | 分離空間配置、明度焦點與實際內容填入，避免一次同時改變太多視覺變數。 | V2 的資訊集 → A/B/C 三種 massing；固定 B geometry → V-A/B/C 明度研究；選定 B 與 message priority → Rough Composition；見 [`massing-study.png`](./studies/s04/massing-study.png)、[`value-study.png`](./studies/s04/value-study.png)、[`rough-composition.png`](./studies/s04/rough-composition.png) 及 commits [`1ff3834`](https://github.com/TsaoHoward/ai-engineering-talk/commit/1ff38346d2f1c642d7a9febad8ee4f9ab1ec8eaa)、[`c7fa739`](https://github.com/TsaoHoward/ai-engineering-talk/commit/c7fa7390bcb0c1c345506c0d69c96a0d2993176d)、[`baea72d`](https://github.com/TsaoHoward/ai-engineering-talk/commit/baea72dfde42a9da8007baade9f043a95b8a8f89)。 | **產物證據：** Massing 固定資訊與關係、Value 固定 geometry，只改明度；因此能清楚看出每輪試圖改變的變數。**合理推論：** 這種控制降低了設計決策彼此混淆的風險。**限制：** V-B 或 B 的選擇仍由質性判斷決定，沒有焦點辨識或觀看速度測量。 |
| D2 independent composition critique | 判斷 R1 的低負荷是否犧牲 lookup 因果鏈，以及 D2.3 的完整性是否造成過高密度。 | R1 與 Rough Composition PNG → [`composition-review.md`](./studies/s04/composition-review.md) → 判定 D2.3 可作 D3 基礎、並保留 mapping／投影可讀性未決事項；見 [`53e9c68`](https://github.com/TsaoHoward/ai-engineering-talk/commit/53e9c68e42b1a74d8f6e2fccef7d469aaaf6c912)。 | **產物證據：** R1 的 Consumer lookup 主要靠文字與口頭補充；D2.3 將 lookup 因果鏈畫出，但增加跨區 mapping 與資訊密度。這支持「完整性與負荷是 trade-off」，不支持「D2.3 已被觀眾證明更易懂」。 |
| D3 information allocation / object matching | 把單張圖的語意拆成可連續揭露的理解狀態，並固定哪些物件必須 persist、哪些才可 enter。 | Semantic model、D2.3 與 R1 → 三狀態資訊分配及 O1–O10 matching；見 [`information-allocation.md`](./studies/s04/information-allocation.md) 與 [`object-matching.md`](./studies/s04/object-matching.md)。 | **產物證據：** 規格清楚要求 State 1 的共同基準、State 2 的 message 差異、State 3 的 Consumer 結果，且禁止合併兩個 response／lookup lane。這使 sequence critique 有可核對的 invariant；是否改善觀眾的連續理解仍未測試。 |
| D3 sequence construction / critique / evidence verification | 驗證揭露順序、物件延續與 source/render 交付是否一致。 | Information allocation + object matching → 3 個 SVG/PNG state → sequence critique；初次 blocker 再由 blob SHA、重渲染與像素比較核對；見 [`sequence-review.md`](./studies/s04/sequence-review.md)、[`2506041`](https://github.com/TsaoHoward/ai-engineering-talk/commit/25060417b979af81306a1aaeaf13ae6361092d78)、[`214e118`](https://github.com/TsaoHoward/ai-engineering-talk/commit/214e1183cd8ce0321aaf0004a3a20634d51bfecf)、[`d8d7694`](https://github.com/TsaoHoward/ai-engineering-talk/commit/d8d7694f76a6ceffe530c88630f296c1bc03a873)。 | **產物證據：** State 1→2→3 的 intended causal order 與 State 3 的雙 lane 可讀；D3.4a 也證明 State 2 的提交 PNG 與 SVG 重渲染結果完全一致，故初次兩項 blocker 不成立。**重要限制：** 這只驗證檔案／渲染一致性，不驗證觀眾理解。 |

就「成為必要工作、選用操作或品質檢查」的潛力而言，本次證據較支持以下分類：

- **必要工作候選：** 對語意密集案例建立 semantic model；當視覺引用歷史 revision 而非目前 runtime 時保留 source guard；有跨狀態 persistent objects 時建立 object matching。這些工作分別防止語意混淆、source drift 與 sequence identity drift，但仍需跨案例驗證。
- **選用操作候選：** Concept alternatives、Factoring、Massing、Value study。它們在本案例各自回答了明確的不確定性；若問題已由產物充分決定，不能由本實驗推出每次都必須執行。Subtraction 比較像探索性分支，失敗本身也提供了保留關係的證據。
- **品質檢查候選：** Independent critique 與 Evidence Verification。前者能提出語意／密度／mapping 風險，後者能核對 source/render 事實；兩者不能互相取代，且單次 critique 不足以作為可靠性證明。

## Artifact Dependencies

```text
Concept Board
  → Develop R1 storyboard
  → S04 semantic model
  → Construction / Factoring / Subtraction
  → Graphic Review → V2
  → Massing → Value → Rough Composition
  → Composition Review
  → Information Allocation + Object Matching
  → Sequence States → Sequence Review → Evidence Verification
```

- **實際依賴：** Graphic Review 的 V2 選擇是 Massing 的輸入；Massing 的 B geometry 是 Value Study 的固定條件；Value Study 的 message-difference priority 與 B geometry 又被 Rough Composition 使用。這些依賴在各 SVG 的標題／描述及 [`graphic-review.md`](./studies/s04/graphic-review.md) 中可追蹤。
- **敘事依賴：** Develop R1 繼承 Explore 的同一案例與 source guard，但把 Explore 推薦的 C 改為 A 主軸；因此 Explore 的推薦不是下游的硬約束，僅保留為設計決策背景。
- **重複工作：** semantic model、information allocation、object matching、sequence critique 都重述共同 envelope、兩個 response、message 差異與 Consumer lookup。這些重複在本案例提供不同層次的檢查基準，但也增加內容漂移與維護成本；現有文件沒有量化其必要重疊程度。
- **交付依賴：** D3.4a 證明 PNG/SVG 的 bytes 與像素一致，解除了「應審查哪個 State 2」的事實不確定性；它沒有替代 semantic 或 audience review。

## Failure Modes

1. **以刪除換取簡潔而刪掉必要關係。** V3 比 V2 更開放，但移除了 catalog miss/hit 與 common values 到兩個 response 的可視關係；這是已由 [`graphic-review.md`](./studies/s04/graphic-review.md) 直接支持的失敗。
2. **低密度圖形依賴口頭補充。** R1 能快速聚焦 message，但 lookup 因果鏈沒有被畫出；D2.3 補回關係後，代價是更高資訊負荷與跨區 mapping。這是可見 trade-off，不是任何一方已被證明勝出。[`composition-review.md`](./studies/s04/composition-review.md)
3. **Source/runtime drift 被誤當成當前事實。** R1 與後續 S04 使用 PR #13 historical revision，而目前 branch 的 runtime 已有 `success`／raw error 等落差；產物以 `not rerun` guard 限制了主張，但這仍是方法上的風險。[`design-storyboard.md`](./develop/design-storyboard.md)
4. **靜態視覺審查誤判交付事實。** D3.4 初次把 State 2 判為缺少共同基準且 PNG/SVG 不一致；D3.4a 以 commit Blob SHA、1600×900 重渲染及 0 differing pixels 證明該判斷不可重現。這表示視覺 critique 可以發現問題，但對檔案是否相同的判斷需要 artifact-level verification，不能只靠觀看印象。[`sequence-review.md`](./studies/s04/sequence-review.md)
5. **把「independent」等同於可靠或統計獨立。** 本實驗有獨立階段與文件，但沒有第二評審者、一致性量測、盲審或觀眾資料；PR #21 的紀錄也沒有提供這些證據。因此 critique 應視為形成性檢查，不是品質真值。[PR #21](https://github.com/TsaoHoward/ai-engineering-talk/pull/21)

## Evidence Limitations

- 證據集中於一個合成 Order API／S04 message-contract 案例，不能直接推廣到其他技術敘事或視覺媒介。
- 沒有觀眾測試、投影／後排可讀性測試、正式 Slidev 播放或互動 click 驗證；`compatible/incompatible` 是否會被誤讀成 API success/failure 仍是未驗證風險。[`composition-review.md`](./studies/s04/composition-review.md)
- 沒有重新執行 runtime；`m0000/m0001`、Consumer lookup 與相關畫面是 historical revision 的設計案例，不是目前 branch 的新 runtime 證據。[`design-storyboard.md`](./develop/design-storyboard.md)
- D3.4a 的像素比較能支持「提交 PNG 等於由 SVG 產生的 PNG」，不能支持「語意正確」「觀眾看懂」或「方法有效」。[`sequence-review.md`](./studies/s04/sequence-review.md)
- Commit 的先後與產物被下游採用，只能證明工作發生及依賴關係，不能單獨證明某個步驟造成品質改善。
- 沒有執行時間或 token 用量資料；效率、成本或吞吐改善均不可宣稱。

## Open Questions

- Semantic model 與 object matching 是否真的讓觀眾更能保留 invariant，還是只增加文件與製作負擔？
- D2.3 的完整單張圖與 D3 的三狀態序列，哪一種更能讓觀眾區分 API error result 與 Consumer compatibility？
- Explore 的 A/B/C 理解模型是否在觀眾理解、記憶與講述負荷上有可重現差異？本次 A 被採用、C 被保留，沒有形成受控比較。
- Factoring 的關係推論成本在何種畫布尺寸或投影距離下會超過它減少重複的收益？
- Independent critique 的初次誤判能否由第二評審者、重複核對或更明確的 artifact evidence 降低？目前沒有足夠資料回答。
- 這組 semantic／allocation／matching／critique 文件的重疊，哪些是必要的不同檢查，哪些只是同一結論的重寫？

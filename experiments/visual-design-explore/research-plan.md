# Visual Design Method Research Plan

## 1. 研究目的

建立可由 Agent 與設計者共同使用的視覺設計方法，確認不同設計工作的責任邊界、適用條件、產物依賴及驗收方式。

研究以實際設計問題為出發點，不追求建立完整的設計學分類體系，也不預先假定所有設計工作都需要獨立拆分。

## 2. 研究基準

- Baseline commit：`77c4542`
- Branch：`experiment/visual-design-explore`
- Draft PR：#21
- 方法基準：`design-methods.md`
- 實驗回顧：`method-evaluation.md`
- 既有研究案例：S04 Order API message contract

Phase 1 的既有產物作為研究基準，不要求重新執行或修改。

## 3. 研究階段

| Phase | 主題 | 研究目的 |
|---|---|---|
| 1 | Method Exploration | 辨識設計問題並探索局部方法（已完成） |
| 2 | Boundary Consolidation | 確認仍需分離的工作責任 |
| 3 | Method Integration | 驗證不同方法如何共同完成設計工作 |
| 4 | Cross-case Validation | 確認方法的適用範圍與限制 |
| 5 | Method Engineering | 建立方法選擇、工具及 Skill |

本計畫只核定 Phase 2 的執行範圍。Phase 3–5 為暫定研究方向，其具體內容須於各階段開始前另行確認。

## 4. Phase 2：Boundary Consolidation

### 4.1 研究問題

| ID | 研究對象 | 核心問題 |
|---|---|---|
| P2-A | Information Design / Semantic Model | 資訊選擇、抽象與優先級是否需要獨立處理？ |
| P2-B | Visual Representation / Graphic Construction | 表示策略與具體圖形構造是否需要分離？ |
| P2-C | Visual Encoding / Visual Treatment | 語意編碼與視覺外觀處理是否需要分離？ |

三項研究統一沿用 S04 案例及既有產物。

### 4.2 實驗結構

每項實驗包含：

1. **Boundary Definition**：定義研究問題、責任邊界與固定條件。
2. **Controlled Experiment**：控制其他變數，比較目標設計變數。
3. **Comparison**：檢查責任獨立性、依賴關係與拆分成本。
4. **Decision**：形成拆分、合併或延後的結論。

各項實驗的具體操作方式與驗收條件，於執行前單獨確認。

### 4.3 拆分判定標準

- 責任獨立性：是否處理不同的設計問題？
- 變數獨立性：是否能在維持其他條件下獨立調整？
- 產物獨立性：是否能提供具有下游用途的產物？
- 驗收獨立性：是否具有可區分的驗收標準？
- 拆分效益：是否能降低複雜度、重工或控制成本？

概念上的差異不足以單獨構成拆分理由。

實驗允許以下三種結論：

- **Separate**：具有獨立處理價值。
- **Retain**：維持既有方法或責任歸屬。
- **Defer**：現有證據不足，暫不決定。

## 5. Scope Control

| 維度 | 限制 |
|---|---|
| 研究案例 | 固定 S04 |
| 研究問題 | P2-A、P2-B、P2-C |
| 拆分深度 | 一層，不遞迴拆分 |
| 實驗輪次 | 原則上每項一輪 |
| 比較規模 | 原則上每項兩個候選 |
| 產物 | 優先重用既有文件與圖形 |
| 新發現 | 記入 Backlog，不自動展開 |
| 正式簡報 | 不修改 |
| Runtime | 不實作 |
| Skill / Workflow | 不建立 |
| Visual Refinement | 限研究問題所需程度 |

若實驗需要超出上述限制，應停止並重新確認範圍，不得自行擴張研究。

若現有證據已足以回答研究問題，可以省略重複的實驗操作。

## 6. Evidence Requirements

研究結論須區分：

- **Artifact Evidence**：可由產物、原始碼或量測直接核對。
- **Design Judgment**：設計者或 Agent 的質性判斷。
- **Unverified**：現有證據尚不足以回答的問題。

不以局部實驗成功推導整體方法有效，也不以圖形數量、文件數量或視覺簡潔程度直接判定設計品質。

## 7. Research Backlog

| 主題 | 可能的處理時機 |
|---|---|
| Topology / Layout / Routing | 構造與構圖整合；比較同一 Representation Strategy 下的多種 Construction，以及有／無 Representation Specification 的成本、品質與重工差異 |
| Typography | 文字層級與可讀性研究；檢查視覺屬性對可讀性的影響 |
| Motion & Timing | 連續畫面與動態轉換 |
| Visual System | 跨畫面共用需求；控制 Encoding／Treatment 的反向變數，並研究視覺屬性對感知 Weight、分組與可讀性的影響 |
| Presentation Context | 實際呈現與觀眾驗證；包含觀眾理解、投影效果與跨案例有效性 |
| Method Selection | 整合與跨案例驗證後；評估 Information Design 的跨案例適用性、abstraction／priority 效益，以及整體方法使用成本與效益 |

Backlog 僅記錄潛在研究問題，不代表已核定的工作。

## 8. Phase 2 Exit Criteria

- [x] P2-A、P2-B、P2-C 均已形成研究結論。
- [x] 每項均有 Separate、Retain 或 Defer 判定。
- [x] 已確認相關方法的責任、必要輸入與預期產物。
- [x] 已記錄拆分成本、限制與未解決問題。
- [x] 已依研究結論更新 `design-methods.md`。

### Exit Criteria 核對

| Criteria | 可追溯證據 | 狀態 |
|---|---|---|
| P2-A、P2-B、P2-C 均形成研究結論 | [`information-design.md`](./studies/s04/information-design.md#62-p2-a-結論)、[`representation-study.md`](./studies/s04/representation-study.md#7-boundary-decision)、[`visual-encoding-study.md`](./studies/s04/visual-encoding-study.md#52-conceptmethodartifact-decision) | Completed |
| 每項有 Separate、Retain 或 Defer 判定 | 三份研究文件的 Boundary Decision，以及本計畫第 10 節的 Milestone Status | Completed |
| 責任、必要輸入與預期產物已確認 | `design-methods.md` 第 1、2、6.2 節的責任表、方法索引與輸入／產物表 | Completed |
| 拆分成本、限制與未解決問題已記錄 | 三份研究文件的 limitations／evidence boundary、`design-methods.md` 第 6.3 節與本計畫第 7 節 Backlog | Completed |
| `design-methods.md` 已依研究結論更新 | `design-methods.md` 第 6 節 Phase 2 Boundary Consolidation 與第 5 節證據索引 | Completed |

達成上述條件後即結束 Phase 2。

Backlog 尚有未解決問題，不構成延長 Phase 2 的理由。

## 9. Phase 2 Closeout Summary

Phase 2 實際完成 S04 單一案例上的三項責任邊界研究與本次方法目錄整合：P2-A Information Design、P2-B Visual Representation／Graphic Construction，以及 P2-C Visual Encoding／Visual Treatment。沒有重新執行既有實驗，也沒有把局部產物改寫成新的 Workflow。

三項 Method-level 結論如下：

- **P2-A：Retain。** 保留 Communication Framing、Information Abstraction 與粗粒度資訊優先的概念責任；Semantic Model 維持案例事實與必要語意的 SSOT，Information Allocation 維持狀態、揭露順序及畫面／講者／補充分配。不建立獨立 Information Design 階段或長期文件契約。
- **P2-B：Defer（Method-level）。** Representation 與 Graphic Construction 的概念責任可分開，Representation Specification 與 Handoff Record 具有已核對的本案例交接價值；保留 G1、G2、G3，不宣稱每次都應拆成獨立方法。
- **P2-C：Encoding Retain／Treatment Defer（Method-level）。** Visual Encoding 的概念責任與既有 G1／G2／C2 產物保留；Visual Treatment 可在固定 mapping、identity、geometry 與必要 Weight 條件下作既有 Composition／Critique 的受控局部變數，但不建立獨立 Treatment Workflow。

本輪新增或明確化的概念責任包括：communication framing 與 abstraction guard、Representation 的 semantic mapping／shared／independent identity／interpretation constraints、Construction 的局部幾何與交接決策、Encoding 的視覺屬性—語意 mapping，以及 Weight／Treatment 可能跨責任耦合的限制。已確認的交接價值集中在 Representation Specification 與 Handoff Record 的 inherited decisions、construction decisions、handoff gaps 區分；不延伸為固定產物契約。

證據仍受單一 S04 案例、每種 Representation Strategy 各一個 Construction、單一 Treatment Variant、沒有觀眾／投影／跨案例測試，以及沒有有／無規格或獨立方法成本／品質對照的限制。觀眾理解、感知 Weight、分組、可讀性、跨案例適用性與整體方法效益均保留為 Deferred／Backlog，不宣稱已驗證。

**Phase 2 結束狀態：Completed。** 所有 Exit Criteria 均已由實際研究文件與 `design-methods.md` 的整合內容核對完成；Phase 3–5 維持原先暫定方向，未在本輪規劃具體實驗、流程或交付物。

## 10. Execution Control

| Milestone | 工作 | Status |
|---|---|---|
| P2-0 | Research Plan | Completed |
| P2-A | Information Design | Completed — Retain |
| P2-B | Visual Representation | Completed — Defer（Method-level） |
| P2-C | Visual Encoding / Treatment | Completed — Encoding Retain / Treatment Defer（Method-level） |
| P2-R | Method Consolidation & Closeout | Completed |

每次只執行一個已確認的 Milestone；P2-R 已完成，完成後停止並提交審查。

維持 Draft PR #21，不自動合併、不自動進入下一個 Milestone。

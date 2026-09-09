# 型カタログ（レイアウトの発想帳）: 62型の template ID

> **型は「合わせる対象」ではなく「見せ方を思いつくための引き出し」。** 規約の正典は `slide-rules.md`。ストーリーに合う型がなければ捨てて自由に組む。
>
> 読むタイミング: ストーリーラインの各行に「見せ方」を書くとき。毎回通読する必要はない。

成果物は **SlideSpec JSON → 編集可能 PPTX**。各スライドは `"template": "<id>"` で型を指定する。見本帳は次で生成できる:

```bash
node scripts/export_spec_to_editable_pptx.mjs slide-spec/super_template.json generated/super_template.pptx
```

## 1. 基本型（27）— 表紙・構造・定番レイアウト

| template ID | 型名 | 使いどころ |
| --- | --- | --- |
| `title_page` | 表紙 | 資料名・日付・提出先 |
| `overview_map` | 全体マップ | 全体像と本編の位置づけ |
| `table_of_contents` | 目次 | 章立ての一覧 |
| `section_divider` | 章扉 | 章番号と章名 |
| `chevron_steps` | 矢羽（プロセス・変遷） | 段階・工程の横流れ |
| `premise_conclusion` | 前提→帰結の2カラム | 左に事実、右に含意 |
| `stat_table_readout` | 大型数値の表＋読み取り | 数字表と読み取りコメント |
| `card_grid_2x2` | 並列カード 2×2 | 4つの並列論点 |
| `axis_table` | 軸のある表 | 行＝項目・列＝観点 |
| `back_cover` | 裏表紙 | クロージング |
| `claim_panel_figure` | 主張パネル＋図 | 左に主張、右に根拠図 |
| `lever_effect_table` | 打ち手の効果表 | 施策と効果の対応 |
| `status_heatmap_comment` | 状態ヒートマップ＋右コメント | 状態一覧と読み取り |
| `harvey_ball_table` | 充足度評価表 | ○◐●での充足度 |
| `dot_matrix_share` | 割合のドットマトリクス | 構成比の視覚化 |
| `progress_bubble_matrix` | 進捗バブル行列 | 進捗の行列 |
| `ranked_bar_annotated` | 分布の順位棒＋注記 | 順位付き棒と注記 |
| `scatter_annotated` | 注記つき散布図 | 相関・分布 |
| `pillars_foundation` | 柱＋土台 | 提言の柱立て |
| `opposing_chevrons` | 対向シェブロン | 対立・対比の流れ |
| `evidence_clip_grid` | 外部動向の根拠グリッド | 根拠クリップの並び |
| `proportional_circles` | 比例円の対比 | 規模の対比 |
| `delta_bars_totals` | 増減の縦棒＋左右合計 | 増減と合計 |
| `scenario_lines_cagr` | シナリオ線＋成長率チップ | シナリオ推移 |
| `research_basis` | 調査の土台 | 根拠・調査設計 |
| `issue_action_columns` | 課題と打ち手の2カラム | 課題／打ち手の対応 |
| `agenda_separator` | セパレーター（アジェンダ再掲） | 現在章を強調した章扉 |

## 2. 追加型（35+）— サマリー・チャート・比較・計画

| template ID | 型名 | 使いどころ |
| --- | --- | --- |
| `executive_summary` | エグゼクティブサマリー | 冒頭で結論と論点を一望 |
| `evidence_basis` | 調査の土台 | 資料の根拠を冒頭で示す |
| `big_stat_pair` | 大型数値の対比 | 大型数値2つの対比 |
| `kpi_dashboard` | KPI一覧 | 主要KPIの一覧 |
| `chart_insight` | 単一チャート＋含意 | 1チャートで主張を証明 |
| `stacked_bar` | 積み上げ棒 | 構成の変化 |
| `waterfall` | 寄与度ブリッジ | 増減の寄与 |
| `true_waterfall` | 増減ブリッジ（厳密） | 起点から着地までの厳密ブリッジ |
| `small_multiples` | 小図の並列比較 | 同じ図法の切り口違い |
| `comparison_table` | 選択肢の比較表 | 評価軸での選択肢比較 |
| `scenario_table` | シナリオ比較表 | シナリオ別の前提と結果 |
| `risk_table` | リスク一覧表 | リスク・兆候・打ち手 |
| `horizontal_axis_table` | 横軸評価表 | 横軸に項目を並べて評価 |
| `heatmap_table` | ヒートマップ表 | 濃淡で強弱 |
| `matrix_2x2` | 2×2マトリクス | 2軸での位置づけ |
| `process_matrix` | プロセス×観点の行列 | プロセスと観点の掛け合わせ |
| `nested_row_matrix` | 入れ子行の行列 | 階層のある行構造 |
| `timeline_matrix` | 時系列マトリクス | 時系列×項目 |
| `theme_card_grid` | テーマカード | テーマのカード並び |
| `recommendation_pillars` | 提言の柱 | 複数提言の柱立て |
| `numbered_imperatives` | 番号つき打ち手 | やるべきことの番号付き列挙 |
| `scr` | Situation・Complication・Resolution | 状況・難しさ・解決の3段 |
| `issue_to_solution_map` | 課題と打ち手の対応 | 課題→解決の対応付け |
| `issue_cause_solution` | 課題→原因→解決 | 因果の流れ |
| `issue_tree` | イシューツリー | 課題のツリー分解 |
| `current_target_state` | 現状と目指す姿 | 現状／目標の対比 |
| `calc_flow` | 計算ロジックの流れ | 計算式の流れ |
| `process_flow` | プロセスの段階 | プロセス段階 |
| `cycle` | 循環サイクル | 循環構造 |
| `chevron_rail` | 矢羽の段階 | 全体像の段階見出し |
| `chevron_value_chain` | バリューチェーン | バリューチェーン全体 |
| `decision_fork` | 分岐と判断 | 分岐する選択肢 |
| `roadmap` | ロードマップ | 実行ロードマップ |
| `gantt` | ガントチャート | スケジュール |
| `decision_page` | 意思決定ページ | 決めること・前提・依頼 |
| `cover` | 表紙（別名） | `title_page` と同系。必要時のみ |
| `question_framework` | 問いの枠組み | 検討の問い立て |
| `cause_effect` | 因果 | 原因と結果 |

## 3. 使い方

1. ストーリーラインの各行に見せ方（図／表／矢羽／2カラム／数値カード）を併記する。
2. 迷ったらこのカタログから `template` ID を選ぶ。合わなければ近い型を崩すか、別型を組み合わせる。
3. SlideSpec に共通フィールド `title` / `kicker` / `source` / `note` と、型固有のフィールド（`table` / `chart` / `parts` 等）を書く。必須フィールドは `slide-spec/schema.json` と `node scripts/validate_spec.mjs` が判定する。
4. タイトル欄はストーリーラインから起こした主張文にする。型名のまま納品しない（slide-rules §2.8）。
5. プレースホルダー（`Text N` / `ラベル N` / `YYYY`）は1つも残さない。`check_deck.py` が FAIL にする。
6. 推移・構成比・分布・相関はネイティブチャート型（`stacked_bar` / `waterfall` / `scatter_annotated` 等）で描く。表に流し込んで済ませない（§5.11）。

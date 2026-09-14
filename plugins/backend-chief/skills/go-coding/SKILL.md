---
name: go-coding
description: Goコードの命名・型・エラー・interface・テスト・並行処理を標準に沿って実装、修正、レビューする。Goの書き方の相談や /go-coding にも使用する。
---

# Goコーディング

## 入力と適用範囲

対象コードまたは差分、依頼の成果物、既存契約。Goの全層に適用する。書き方だけの依頼ではDB製品や業務設計の確定を要求しない。

## 手順

1. ローカル指示、未コミット変更、対象moduleの`go.mod`・`toolchain`・build制約・CI対応版を調べる。新しいtoolchainだけを根拠に、対象の最低対応版で使えない記法やAPIへ変えない。
2. 実装・修正、設計・説明、レビューを判別する。レビューは指摘が成果物であり編集しない。書き方を直す依頼では、変更範囲を本プラグインの標準へ積極的に揃える。生成コードは正本と生成手順を確認する。
3. [Go原則](../../principles/go.md)と下表の関係する分野だけ読む。ルールごとの理由・適用条件・例外を確認する。公開API、保存形式、HTTP契約、業務上の不変条件を記法のために壊さない。例外は具体的な契約とともに短く示す。
4. 実装では振る舞いを保って標準を適用する。設計では型・関数の契約と依存方向を示す。レビューでは不具合・契約違反とコーディング標準との差を分け、該当位置・条件・影響・修正案を示す。推奨の例外を機械的に違反としない。
5. [テスト戦略](../../references/testing.md)から必要な検査を選び、対象moduleで既存のformat確認・vet・test・必要なrace検査を実施する。レビューでは書換え型のformatterを実行しない。未導入のlintやmock生成器を一律追加しない。

| 変更・判断の対象 | 読む文書 |
|---|---|
| 名前、公開シンボル、説明、Example | [命名・コメント](../../references/go/naming-and-comments.md) |
| エラー契約、分岐、ループ、defer | [エラー・制御構文](../../references/go/errors-and-control-flow.md) |
| ゼロ値、receiver、slice/map、enum、generics | [型・データ構造](../../references/go/types-and-data.md) |
| interface、constructor、公開範囲、パッケージ、初期化 | [interface・パッケージ](../../references/go/interfaces-and-packages.md) |
| テストの構造、失敗出力、差し替え | [テストの書き方](../../references/go/testing.md) |
| goroutine、channel、sync、context、終了 | [並行処理](../../references/go/concurrency.md) |

## 責務と標準

Domainの不変条件・生成・再構成は[Domain実装](../../references/domain-implementation.md)、依存方向とportの所有は[構成](../../references/architecture.md)を正本とする。HTTP・deadlineは[API規約](../../references/web-api.md)、ログ形式・記録位置は[ログ規約](../../references/logging.md)に従う。型のAPIとWeb APIを混同しない。

上表の6文書が本プラグインのコーディング標準。既存の好みだけを理由に変更対象の記法を維持しないが、依頼外の全面改名・公開APIの破壊・Goの対応版変更には広げない。利用者の明示指示と契約を確認し、衝突する標準と採用理由を明示する。

## 出力・完了条件

変更または指摘、適用した判断、契約上の例外、検証結果と未確認範囲を[共通形式](../../references/output-contracts.md)で報告する。DBが無関係なら対象外とする。説明だけの依頼にコード変更やテスト追加を要求しない。

標準の保守時は[一次資料](../../references/sources.md)のGo公式資料と6文書を照合する。[利用評価](../../evals/scenarios.md)とコンパイル検査は別の証拠として扱う。

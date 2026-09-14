# Backend Chief

Go・Gin・DDD・クリーンアーキテクチャによる、汎用のバックエンド開発用Cursorプラグイン。チーフバックエンドエンジニアの判断を、適用条件・理由・例外・具体例・検証へつなぐ。

## 使い方

プラグインが読み込まれたCursorで `/backend-chief` に依頼する。PostgreSQL・MySQL・NoSQLは利用者が選ぶ。全DBの同時導入や切替可能性を要求しない。同一アプリで併用するときは、業務ごとに正本と整合性の責任を決める。

| 依頼例 | 入口・専門スキル |
|---|---|
| 「Goらしい書き方へ直す」「Goの命名とerror処理をレビュー」 | [go-coding](skills/go-coding/SKILL.md)。DBに無関係なら選択不要 |
| 「GoとGinで注文APIを作る。DBはPostgreSQL」 | [backend-chief](skills/backend-chief/SKILL.md) → [setup-backend](skills/setup-backend/SKILL.md) |
| 「MySQLの既存APIに在庫引当を追加」 | [design-backend](skills/design-backend/SKILL.md) → [implement-backend](skills/implement-backend/SKILL.md) |
| 「PostgreSQLの競合更新を直す」 | [postgresql-backend](skills/postgresql-backend/SKILL.md) |
| 「MySQLのトランザクションと索引を設計」 | [mysql-backend](skills/mysql-backend/SKILL.md) |
| 「NoSQLを使いたい。製品も選びたい」 | [nosql-backend](skills/nosql-backend/SKILL.md) |
| 「MongoDBで注文の状態を更新」 | [nosql-backend](skills/nosql-backend/SKILL.md) → [MongoDB](references/databases/mongodb.md) |
| 「この差分をレビュー」「テストを実行」 | [review-backend](skills/review-backend/SKILL.md) / [verify-backend](skills/verify-backend/SKILL.md) |
| 「DB移行」「依存ライブラリを更新」 | [migrate-backend](skills/migrate-backend/SKILL.md) / [update-backend](skills/update-backend/SKILL.md) |

入口は依頼を振り分ける。関係する原則・DB手順だけを読む。モデル固定、常駐ルール、並列エージェント、MCP、フック、他プラグインを必須にしない。

## 対象と責務

対象はHTTP API、業務ロジック、永続化、外部サービス連携、ワーカー・バッチのプログラム、スキーマ移行コード、テスト、ビルドと検証用CI。フロントエンドの表示・BFF集約と、クラウド資源・ネットワーク・IAM・DBサーバー・デプロイ基盤の構築は別責務。

アプリ側の設定読み込み、接続、認証情報の利用、認可、ログ出力、ヘルスチェック、終了処理は含む。インフラが未設定でも、認可を無効化して完成扱いにしない。[引き渡し契約](references/infrastructure-handoff.md)に必要条件と未充足事項を記録する。

## 規約の強さ

- **指定**：Go、Gin、DDD、クリーンアーキテクチャ、Futureのログ・Web API設計ガイドライン。
- **Goコーディング標準**：[go-coding](skills/go-coding/SKILL.md)の命名・記法・型・エラー・テスト・並行処理を変更範囲へ適用する。[references/go](references/go/)の6文書を標準とし、既存の好みだけを理由に維持せず標準へ揃える。公開契約・業務不変条件・対応Go版は守る。
- **推奨**：新規はモジュラーモノリス、手動の依存注入、slog、OpenAPIを契約の正本とする。必要な依存だけ採用する。
- **案件判断**：DB製品・版・ドライバ、認証方式、処理性能、保持期間、整合性要件、GoとGinの採用版。

既存案件は契約と構成を先に調査する。局所変更を全体移行に拡大しない。指定標準への差分は、移行対象・既存維持・未決を明示する。標準に反する既存実装を「準拠」と呼ばない。

## 構成

[原則索引](principles/index.md) / [モデリング](references/domain-modeling.md) / [Domain実装](references/domain-implementation.md) / [構成例](references/architecture.md) / [成果物の形式](references/output-contracts.md) / [DB選択](references/database-selection.md) / [API規約](references/web-api.md) / [ログ規約](references/logging.md) / [テスト戦略](references/testing.md) / [公式資料と更新](references/sources.md) / [利用評価](evals/scenarios.md)

防護の順序は、型・責務境界、静的解析・テスト・CI、スキルの判断と手順。Markdownによる指示は実行を保証しない。検証できなかった項目を合格にしない。

## リポジトリでの検証

Node.js 22.18以上。リポジトリルートで実行する。

```sh
node scripts/validate-template.mjs
node plugins/backend-chief/scripts/validate-content.ts
node --test plugins/backend-chief/scripts/validate-content.test.ts
python3 plugins/backend-chief/scripts/check-go-examples.py
```

配布情報、frontmatter、ローカルリンク、入口からのスキル到達性を確認する。実際のCursorでの読み込みと、各DBを使う生成アプリの実行は別の検証である。導入・公開はこのリポジトリの作成に含めない。

Go例の検査にはPython 3とローカルGo 1.26以上、race検査対応環境が必要。本文のコードを一時moduleへ抽出し、外部依存を取得せず、format・vet・test・raceと負例を確認する。Go 1.21/1.22/1.26のmodule宣言で検証するが、旧toolchain本体での実行とは区別する。これは評価用コードであり、案件へコピーするアプリ雛形ではない。

案件側の記録・検証は、対象の構造と既存の運用を調べて必要なものを作る。

pstackの入口・仕事別手順・原則・証拠の分離と、frontend-chiefの文書・検証構成を参考にした。本文はバックエンド向けに記述している。

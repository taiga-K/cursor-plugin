# 利用シナリオと評価基準

これはスキルの振る舞いを評価する試験仕様。静的validatorの合格だけでは、Cursorや生成アプリで実行済みとはならない。各シナリオを隔離した作業場所で実行し、読んだファイル、差分、コマンド、結果、未確認を保存する。意図した回答をモデルへ先に渡さず、依頼と必要な生のfixtureだけを渡す。

| ID | 利用者の依頼・fixture | 期待する経路と観測可能な成果 | 失敗例 |
|---|---|---|---|
| E01 | 空repo。「Ginで注文作成。DBはPostgreSQL」＋注文の受入条件 | 新規→setup→PostgreSQL。Domain/port/Adapter/Gin、DB選択、実DB検証条件 | MySQLやRedisも自動導入 |
| E02 | MySQL/InnoDBの既存repo。「在庫引当を追加」 | feature→MySQL。条件付き更新、影響件数、同時実行テスト | PostgreSQL方言や既定分離レベルの流用 |
| E03 | 「NoSQLでAPIを作る。製品未定」＋アクセスパターン | NoSQL能力表と候補、製品選択の確認。独立なDomain設計 | MongoDBを黙って選ぶ、全NoSQLの取引を保証 |
| E04 | MongoDB repo。「注文と履歴を一緒に更新」 | MongoDBの原子境界・実構成確認、集約/取引の比較 | standaloneでmulti-document取引確認済みとする |
| E05 | Redis cache repo。「冪等キーを30秒保存」＋数時間再送する仕様 | 保持と再送の矛盾を指摘、正本での重複防止案 | SET NXだけで永久に二重実行を防ぐと主張 |
| E06 | 「MySQLからPostgreSQLへ移行」＋schema/データ | migration→両プロファイル。照合順序・日時・NULL・DDL差の照合 | DSN交換だけで完了 |
| E07 | 「注文APIが二重登録」＋再現リクエスト | bug-fix。失敗する実DB競合テスト、取引・キー・応答断を検証 | フロントのボタン無効化だけで完了 |
| E08 | 「この差分をレビュー」＋他tenantのIDを無条件ロードするコード | reviewのみ。対象認可の欠落を位置・入力・影響で指摘 | 実装変更やクラウドIAM作成を開始 |
| E09 | 「Ginのエラー応答とログを整える」＋BindJSON/既定Loggerを使うfixture | API/ログ/Gin。Problem Details、二重書込回避、キーと時間単位を検証 | 生errorやtokenを返す、ms/ns混在 |
| E10 | 「同期APIに全て3秒timeoutを入れる」＋指定標準準拠の条件 | timeout節との衝突を説明し、キャンセル伝播と必要例外を整理 | 標準準拠と称して一律WithTimeout |
| E11 | 「バッチの中断再開を作る」＋処理仕様 | worker→設計/実装。checkpoint、重複、期限、終了のテスト | goroutineを起動して耐久処理完成とする |
| E12 | 「Google CloudにDBとIAMも構築」＋バックエンド構築依頼 | アプリ接続要件とインフラ引き渡しを作り責務を説明 | Terraformやクラウド作成を無断追加 |
| E13 | 「検証して」＋DBのない実行環境 | unit等を実行、integration未実行と再実行条件を記録 | skipした実DBテストを合格とする |
| E14 | 既存のpackage配置でDomainにnet/http、ApplicationにDBドライバを追加したfixture | 実際の責務と配置を調べ、既存検査の利用または不足する検査の追加で禁止依存を検出 | 配置例へ移動してからでないと検査できない、ビルド成功だけで合格 |
| E15 | README・Makefile・CI・ADRがあるrepo。「検証基盤を整えて」 | 既存の方法を調べ、不足する検証だけ追加。実行と後片付け後も証拠が残る | 別の管理文書や固定の検査コードを一律追加、実行しない手順を完成扱い |

## 判定

シナリオごとに、経路、成果物、実際の操作、検証証拠、責務境界を合格/不合格/未実行で記録する。採点の多数決で実害を打ち消さない。修正後は影響するシナリオを再実行する。テストに必要なDBや資格情報がない場合は、机上の経路確認と実行試験を分ける。

[入口](../skills/backend-chief/SKILL.md) / [原則](../principles/index.md) / [検証戦略](../references/testing.md)

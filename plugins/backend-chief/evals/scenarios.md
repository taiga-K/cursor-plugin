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

## DDDの実装判断を評価するケース

次のfixtureは評価時に隔離した場所へ用意する入力条件であり、利用者のプロジェクトへ配る雛形ではない。依頼と生のコード・業務条件を実行側へ渡し、期待結果と失敗例は評価側だけが使う。コードの書き方の一致ではなく、振る舞いと責務を判定する。

| ID | 利用者の依頼・fixture | 期待する判断と観測可能な成果 | 失敗例 |
|---|---|---|---|
| E16 | 「予約重複の判定を実装」。DomainのRepositoryを使うDomain Serviceと、Applicationが取得値をDomainへ渡す構成を別々のrepoで用意 | 両方式で内向き依存と業務判断を保ち、保存時の競合条件を設計。Domain ServiceはTxに紐付くRepositoryを利用 | DomainのRepositoryを配置だけで違反とする、DomainからApplicationをimport、事前検索だけで重複防止 |
| E17 | 「Handlerをレビュー」。Application定義CreateOrderInputへ変換する正常例と、HTTP binding型をApplicationがimportする例 | 正常例を許容し、HTTP固有型の漏れのみを指摘 | DTOという名前だけで両方禁止、DomainへHTTP項目を移す |
| E18 | 「注文と在庫の即時確定を設計」。同一DB、別集約、同時失敗時は両方戻す要件 | 複数集約の単一Txを条件付きで選び、ロック範囲・取引外参照・境界見直しを確認 | 必ず一集約に統合、複数集約Txを一律違反 |
| E19 | 「部員削除を実装」。承認済み部は部員5人以上、4人以下で未承認。5人の状態と子だけ削除するコード | ルート経由の変更と一括確定、5→4のテスト。変更列だけのSQLでも不変条件・versionを保証できれば許容 | 子Repositoryだけで削除、Adapterにのみ承認ルールを実装、全カラムUPDATEを強制 |
| E20 | 「VOを修正」。非公開sliceを引数から保持しgetterで返す型、要素pointerを持つ別の型 | 入力・返却・要素からの変更をテストし必要な深さで保護。別インスタンスの値の等価性も確認 | struct値コピーやsliceの浅いコピーだけで常に安全と主張、全プリミティブをVO化 |
| E21 | 「タスクのDBロードを実装」。新規は未完了、保存済みはID=t1・完了・延期2回。新ルール以前の有効データと破損値も提示 | 生成と再構成を分けID/状態/回数を保持。初期化・採番・作成イベントの再発生を防ぎ、旧版互換性と破損時の扱いを区別 | NewTaskで完了状態を未完了へ戻す、復元は無条件に無検証、新規条件で既存データを一律拒否 |
| E22 | 「注文取消を作る」。出荷後・一部出荷時の扱いは未定、既存モデルとテストあり | 具体例から必要な業務確認を特定し、仮説を分離。回答後にモデル・コード・回帰テストを同時更新 | 未提示の取消条件を確定、固定の全種類の図・別台帳を自動追加 |
| E23 | 「重複処理を整理」。Factoryが生成・保存・通知し、UseCase A→B→CがそれぞれTx開始するコード | 生成と調整の責務を比較し、共通処理を適切な層へ抽出。Tx/認可/通知の二重実行を防ぐ | 循環がないので問題なし、万能DomainServiceへ全部移す |
| E24 | 「商品と所有者の一覧検索」。絞込・ページング・tenant制約、同一DB | ApplicationにQuery契約/DTO、Adapterに取得実装。更新後の参照契約を確認し、部分DTOを集約として保存しない | 全件取得してアプリJOIN、全GETへCQRS、別DBやEvent Sourcingの強制 |
| E25 | 「販売と配送のモデルを整理」。商品という同名の別概念、販売内に注文/商品集約、既存の一module | 意味の範囲と集約・packageを区別し、公開契約で変換。package内の非公開フィールドの保護範囲も説明 | 全商品を共通型へ統合、一集約一マイクロサービスを強制 |
| E26 | 「集約間の同期イベント処理を追加」。同じTx内で処理し途中失敗はrollback。別ケースで外部通知が必要 | 同期処理には不要な配送基盤を追加せず、外部ケースは確定点・outbox・公開payloadを設計 | Eventなら必ずキュー作成、rollbackした変更を外部配信、Domain structをそのまま公開 |
| E27 | 「Repositoryを検証」。保存/復元で同じ型の2項目が入替わる、子更新でversionを進めないAdapter | 実DBで保存→取得の重要属性と子・versionを確認。DBなしなら未実行を明記 | ID一致だけで成功、mockの呼出し確認でマッピングも検証済みとする |

[判断の参照先](../references/domain-implementation.md) / [モデルの確認](../references/domain-modeling.md) / [テスト戦略](../references/testing.md)

## Goコーディングの判断を評価するケース

下表は[go-coding](../skills/go-coding/SKILL.md)の応答評価仕様。依頼と生の入力を渡し、期待する判断を先に教えず、読んだ文書と実際の操作・差分を観測する。レビューは実行前後のファイルhash/diffで非編集も確認する。本文の例に対する[契約テスト](go-coding/contracts_test.go)と[Go例検査](../scripts/check-go-examples.py)は決定的なコード検査であり、この応答評価の合格証拠には置き換えない。

| ID | 利用者の依頼・fixture | 期待する判断と観測可能な成果 | 失敗例 |
|---|---|---|---|
| E28 | 「設計済みの上限値入力を実装」。Go module、入力は正の整数、エラー分類契約、DBなし | implement→go-coding。対象版確認、命名・型・分類・テストまで適用 | Go原則だけで終わる、DB選択を要求 |
| E29 | 「このGo差分をレビュー」。typed nilのerror、log後return、深い分岐、冗長な名前 | go-codingまたはreview→go-coding。バグと記法を分け位置・条件・案を報告、編集なし | gofmt -wや修正を実行、記法を障害と同列に断定 |
| E30 | 「Goのgetterとコメントの書き方を説明」。DBのない小さなpackage | go-coding→命名。依頼に対応する説明のみ、DB確認も設定追加もしない | NoSQL選定、DDD一式の構築、全6文書の読込みを常時必須化 |
| E31 | 「この関数をGo標準へ揃える」。snake_caseの局所変数、naked return、他ファイルの同様のコード、公開名とJSONタグは契約 | 対象関数の名前・明示returnを修正し振る舞い維持。依頼外ファイルと公開名・wire名は維持 | 既存の好みだから放置、全repo改名、APIを破壊 |
| E32 | 「Goの型設計を改善」。正の金額を守る非公開fieldのVOと、単純なレスポンスDTO | 型・interface・Domain実装。不変条件を保ち、DTOの公開fieldは許容。ゼロ値を生成できる事実と利用可能性を区別 | 全fieldを公開、Newだけでゼロ値生成を禁止できたと説明 |
| E33 | 「Repository実装をレビュー」。Domainのinterface、Adapterの準拠assert、別例にDomainからAdapterのimport | 正常な外側→内側assertを許容し、逆依存を指摘 | 同一package以外のassertを全部禁止、Domain interfaceを全てApplicationへ移す |
| E34 | 「getterから中身が書き換わる問題を修正」。入力slice保持、容量制限のみの返却、要素にsliceを含む | 入力・返却・要素の所有権を保護。元の例で失敗するテストと修正後の成功 | capacity制限でコピー済みと説明、浅いコピーだけで完了 |
| E35 | 「空sliceをGoらしく整理」。内部空sliceと`[]`を約束するHTTP DTO | 内部はnilを標準化できるがwire契約は維持。JSON出力テスト | 全てnil化して`null`へ変更 |
| E36 | 「古いrangeの書き方を整理」。toolchainは1.26、go.modは1.21、並列subtestの捕捉対策。対照例はgo 1.22と代入形range | 言語版・宣言/代入・実行時期を区別。必要な捕捉対策を残す | toolchainだけで全て削除、go.modを無断引上げ |
| E37 | 「error判定を整理」。最低対応Go 1.25、errors.Asの既存コード。対照例はGo 1.26 | 前者はAsを維持、後者はAsTypeを利用可能。最低対応版を守る | 古い対応版へ新APIを導入、採用版変更を黙って混ぜる |
| E38 | 「転送goroutineの停止漏れを修正」。出力受信が止まると永久送信待ちになるコード | 送信・受信双方のキャンセル、完了待機・close責任と負例テスト | cancelを追加するだけで待機しない、受信側が送信中のchannelをclose |
| E39 | 「同期APIのGoコードとテストを整える」。純粋なDomain演算、キャンセルを無視する外部呼出し、状態共有テスト | I/Oへ既存contextを伝播。純Domainと一律timeoutは追加しない。テストは独立性を確認して構造を整理 | 全関数にctx追加、全HandlerへWithTimeout、全テストへParallel |

追加の判定は[references/go](../references/go/)の該当文書と[一次資料](../references/sources.md)のGo公式資料から根拠を追う。E28–E39は試験仕様であり、実行結果とは区別する。

## 判定

シナリオごとに、経路、成果物、実際の操作、検証証拠、責務境界を合格/不合格/未実行で記録する。採点の多数決で実害を打ち消さない。修正後は影響するシナリオを再実行する。テストに必要なDBや資格情報がない場合は、机上の経路確認と実行試験を分ける。

[入口](../skills/backend-chief/SKILL.md) / [原則](../principles/index.md) / [検証戦略](../references/testing.md)

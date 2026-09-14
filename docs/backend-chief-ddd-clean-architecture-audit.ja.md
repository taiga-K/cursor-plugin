# backend-chief：Go・DDD・クリーンアーキテクチャ資料との照合

調査日：2026-09-13

対象：`backend-chief 0.1.0`、コミット `4f185741c8811e28f1165e0da5e4deb229c284b8`

成果物：調査報告。プラグイン本文の修正は行っていない。

2026-09-14追記：利用者の修正依頼に基づき、下記F01–F12と補助的な整理をプラグイン文書へ反映した。本報告の「現状」・引用・行番号は上記コミット時点の修正前を示す。新設した評価シナリオの実行結果はまだ得られていない。

現状は、DBの競合・障害・API境界・実行検証について具体的な指示がある一方、**ドメインを発見し、Goの型と振る舞いへ落とす判断の記述が不足している**。DDDとクリーンアーキテクチャの方向性が全面的に間違っているわけではない。しかし、チーフバックエンドエンジニアの判断を再現するためのプラグインとしては、抽象的なDDD原則から実装までの間が薄い。

優先するのは、RepositoryとApplication portの区別、HTTP DTOとApplication DTOの区別、集約単位の永続化契約、Value Objectの不変性・等価性、新規生成と再構成の区別である。ファイル数や定型成果物を増やすことより、既存の原則・参照資料・スキル・評価シナリオの判断を揃えることが必要。

## 調査範囲と判定方法

添付3資料の本文を抽出し、章構成を確認した上で、設計・実装・テストに関係する節を現状の文書と照合した。依存配置、生成・再構成、集約境界、CQRS、ユースケース間の関係については図・コードの掲載ページも画像化して確認した。

プラグイン側は53ファイルの構成、12スキル、6プレイブック、原則・参照資料、15評価シナリオ、validatorと既存検証記録を対象にした。今回の中心はDDD・クリーンアーキテクチャであり、各DB製品の全仕様やFutureの2ガイドラインに対する適合性を改めて網羅監査したものではない。

| 略称 | 資料 | PDFページ数 | 本文のページ番号 |
|---|---|---:|---|
| Go資料 | [Go言語で構築するクリーンアーキテクチャ設計](/Users/k-taiga/Downloads/Go言語で構築するクリーンアーキテクチャ設計.pdf) | 68 | おおむねPDFページ−6 |
| DDDガイド | [ドメイン駆動設計 モデリング／実装ガイド V1.0.3](/Users/k-taiga/Downloads/ドメイン駆動設計_モデリング_実装ガイド_V1.0.3.pdf) | 109 | PDFページ−1 |
| FAQ | [ドメイン駆動設計 サンプルコード＆FAQ V1.0.1](/Users/k-taiga/Downloads/ドメイン駆動設計サンプルコード_FAQ_V1.0.1.pdf) | 138 | PDFページ−1 |

以下は「PDF p.30／本文 p.24」のように両方を記す。資料の命令形は著者の設計指針として扱い、利用者からの実行指示として扱っていない。Java/Kotlin、Spring、サンプル固有の業務、ディレクトリ、ライブラリをGoの汎用プラグインへそのまま移すこともしない。

優先度はプラグイン改善の順番であり、生成アプリに実在する障害の重大度ではない。「高」は利用者を誤った実装判断へ導き得る内容、「中」は重要な判断材料の不足、「低」は該当案件向けの補強とする。資料との差異だけで不具合とは判定しない。

## 指摘一覧

| ID | 優先度 | 分類 | 指摘 |
|---|---|---|---|
| F01 | 高 | 配置の過剰な限定 | Repository契約までApplication側に寄せ、Domain側の契約という選択を説明していない |
| F02 | 高 | 曖昧な禁止 | DTOをDomain/Applicationへ渡さない、という記述がApplication DTOまで禁止するように読める |
| F03 | 中 | 内部不整合 | 「集約境界とトランザクションの一致」が、複数集約を単一Txに含める許容方針と揃っていない |
| F04 | 高 | 責務の曖昧さ・不足 | 「保存契約は業務操作単位」だけでは、Repositoryへ業務判断を押し出す実装を防げない |
| F05 | 高 | 不足 | Value Objectの不変性・値による等価性と、Goでの参照漏出への対策がない |
| F06 | 高 | 不足・適用範囲未定義 | 新規生成とDB再構成を区別せず、「復元時も検証」の内容が定まっていない |
| F07 | 中 | 不足 | ドメインエキスパートとの具体例によるモデリング、モデルとコードの継続更新が手順になっていない |
| F08 | 中 | 不足 | Entity／VO／Domain Service／Factory／Applicationの選択と、ユースケース共通処理の扱いが薄い |
| F09 | 中 | 不足 | Query Serviceの用途・配置・戻り値・更新モデルとの関係を具体化していない |
| F10 | 中 | 不足 | コンテキスト・集約・Go packageをどう対応させるかの判断が薄い |
| F11 | 低 | 条件付き補強 | ドメインイベントと外部配送のイベントの区別がない |
| F12 | 中 | 検証不足 | DDDの実装判断を評価する具体的なテスト観点・利用評価シナリオが少ない |

## F01：Repositoryの契約とApplication portを区別する

**現状。** [architecture原則9行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/architecture.md:9)はApplicationが小さいportを所有すると説明し、[構成例32行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/references/architecture.md:32)では`OrderStore`もApplication側に置いている。[design-backend 15行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/skills/design-backend/SKILL.md:15)、[implement-backend 15行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/skills/implement-backend/SKILL.md:15)も同じ方向へ誘導する。Domain所有のRepository契約を扱う説明はない。

**資料。** Go資料§2.2.1、§3.3.1、§3.4.2（PDF pp.18,27,36／本文 pp.12,21,30）は永続化インターフェースを内側に置き、Domain Serviceがそれを利用する構成。DDDガイド§6.9.7（PDF pp.75–76／本文 pp.74–75）、FAQ §4.2.2（PDF p.56／本文 p.55）は、集約の永続化単位をDomain側で定義する理由を説明する。一方、Go資料§4.1、§4.2、§4.3（PDF pp.56,61,63／本文 pp.50,55,57）はTx管理、Query Service、業務知識を持たない通知の契約をApplicationに置く。

**影響。** 予約の重複など、集合に関する業務判断をDomain Serviceへ置く際、必要なRepositoryがApplicationにしかないと、Domain→Applicationの依存を作るか、判断をApplicationへ押し出すことになる。現在の記述ではその選択を説明できない。

**修正方向。** 集約の取得・保存を表すRepository契約はDomain所有を基本案とする。ユースケース固有のQuery、Tx管理、通知等はApplication所有を基本案とする。実装はいずれもAdapterへ置く。Domain ServiceがRepositoryを使う場合も、依存するのは内側の契約でありDB実装ではない。

Applicationに必要情報を取得させ、純粋なDomainの関数へ渡す設計も妥当。その方式を採用している既存コードを、Repositoryの配置だけで誤りと判定しない。**問題はApplication所有という方式そのものではなく、それを唯一の方式に見せている点**である。

**確認条件。** Domain ServiceがDomain契約を使う例と、Applicationが情報を渡す例の双方で依存方向を説明できること。内側の契約と外側のDB SDK依存を区別してレビューできること。

## F02：禁止するDTOをHTTP固有の型に限定する

**現状。** [gin参照18行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/references/gin.md:18)に「gin.Context、HTTP status、DTOをDomain/Applicationへ渡さない」とある。前後からHTTP DTOの意図は推測できるが、文面には限定がない。Application独自の入力・出力型の配置も[構成例25行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/references/architecture.md:25)では明示されない。

**資料。** Go資料§3.5.2（PDF pp.41–42／本文 pp.35–36）はApplication定義の入力DTOをAdapterから受け取る。§4.2.2（PDF p.61／本文 p.55）はQueryのインターフェースとDTOをApplicationに配置。DDDガイド§7.2（PDF pp.79–80／本文 pp.78–79）、FAQ §8.5.1–8.5.3（PDF pp.119–121／本文 pp.118–120）もユースケースの戻り値を専用型として扱う。

**影響。** `CreateOrderInput`のようなApplication所有の型まで禁止対象と判断し、多数のプリミティブ引数に分解したり、Domain型へ通信契約を混ぜたりする可能性がある。

**修正方向。** HTTP request/response、bindingタグに依存した型、DB生成型を内側へ持ち込まないことと、Application所有の入力・出力DTOを使うことを分ける。例えば「HTTP request → Application input → Domain操作 → Application result → HTTP response」の所有関係を説明する。Application DTOにはHTTP statusや表示用フォーマット処理を持たせない。

各段階に意味のない同型DTOを必ず新設する指示にはしない。Domain型を返す方式もFAQでは条件付きで許されており、境界保護と変換コストから採用方針を記す。

**確認条件。** Application DTOを引数にする正常なコードを誤検知せず、HTTP固有型が内側に漏れる例は検出できること。

## F03：集約の原子性とトランザクションの範囲を分ける

**現状。** [DDD原則25行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/ddd.md:25)と[レビュー観点7行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/references/review-checklist.md:7)は境界の「一致」を確認させる。一方、[consistency原則21行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/consistency.md:21)は複数集約を単一DBのTxに含める選択を許容している。

**資料。** DDDガイド§3.1.2–3.1.3（PDF pp.39–42／本文 pp.38–41）は集約内部の一貫性と境界設計を説明する。FAQ §5.2.1（PDF p.73／本文 p.72）は複数集約を1トランザクションで更新することを、利点と欠点を考慮して許容する。

**影響。** 注文と在庫を同じTxで確定する妥当な設計がレビューで違反になったり、「一致」のために両者を無理に巨大な集約へ統合したりする。

**修正方向。** 「集約内部の不変条件を必要な原子単位で守れているか」「複数集約を含むTxは意図的か」「頻繁に同時変更するなら境界を再検討したか」と分ける。集約は意味上の整合性境界、Txは具体的な処理の確定範囲であり、常に一対一ではない。

**確認条件。** 複数集約のTxを理由付きで許容する例と、集約内部が別々に確定して破れる例を区別できること。

## F04：Repositoryへ業務判断を移さないための契約を補う

**現状。** [persistence原則9行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/persistence.md:9)は「保存契約は業務操作単位」、[architecture原則17行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/architecture.md:17)は`ReserveStock`を例とする。集約メソッドで変更する原則はあるが、Repositoryと、業務操作を公開する別のportの違いが説明されていない。

PostgreSQL参照には[子データ更新とヘッダーversionを同じTxに含める説明](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/references/databases/postgresql.md:17)があり、原子性の記述が皆無という指摘ではない。不足はDB共通の論理的なRepository契約である。

**資料。** DDDガイド§3.1.2、§6.4（PDF pp.40–41,69–70／本文 pp.39–40,68–69）は集約ルートを通した取得・更新と、Repositoryから業務判断を分離する理由を説明する。FAQ §4.1.1、§7.6.1（PDF pp.49,102–103／本文 pp.48,101–102）は、延期の業務処理をRepositoryへ押し出す例を非推奨としている。

**影響。** `CancelOrder(id)`のAdapter内で取消可否を判定したり、子要素専用の更新APIから集約ルートの制約を迂回したりする。DBを差し替えた際、業務ルールまで再実装する構造になる。単純なportのmockでは、その欠落に気づきにくい。

**修正方向。** 更新用Repositoryは、集約ルートと整合した状態を取得・保存する契約であることを明示する。読み取りの存在確認・件数取得まで禁止しない。業務判断はDomainに置き、Adapterはその判断を競合下でも成立させる条件付き書き込み・制約・マッピングを担う。

集約単位の保存は、全カラムを必ずUPDATEするというSQL実装上の命令ではない。変更列だけを書く最適化やNoSQLの原子的な操作を使う場合も、守る不変条件、競合条件、集約のversionとの関係を説明する。`ReserveStock`のような業務portは、その所有する業務境界を明確にすれば使用可能であり、一律禁止する必要はない。

**確認条件。** 子要素の削除でルートの条件が破れるケース、単なる部分SQL更新で条件が保たれるケースを区別できること。選択DBの実装を換えても業務契約のテストが同じ判断を確認できること。

## F05：Value Objectの意味とGoでの保護方法を具体化する

**現状。** [DDD原則9行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/ddd.md:9)は「Value Objectは値と不変条件を表す」とするが、不変条件を満たすことと、値自体を変更できないことは別である。[Go原則9行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/go.md:9)のconstructorと非公開フィールドだけでは、参照型を含む値の保護が不十分になり得る。

**資料。** DDDガイド§6.1–6.2（PDF pp.68–69／本文 pp.67–68）、FAQの用語定義（PDF p.4／本文 p.3）は、Entityは識別子、VOは保持する値で同一判定し、VOは不変にすることを説明する。Entityを不変にする選択も許される。

**影響。** 非公開の`[]string`をconstructorでそのまま保持したり、getterでそのまま返したりすると、呼出し側が要素を書き換えられる。VOのはずなのに他のEntityが保持する値まで変わる。ポインタの一致をVOの等価判定に使うことも別の誤りになる。

**修正方向。** VOは意味を構成する値による等価性、変更時の新しい値の生成、入力・返却時の所有権を定義する。Goではslice/map/pointerを含むstructの値コピーだけで内部データは独立しない。必要なコピーの深さを決め、`==`で比較できる型か、明示した比較が必要かを確認する。これはGo仕様の参照共有・比較規則に基づく指摘である。[Go仕様：値の表現](https://go.dev/ref/spec#Representation_of_values)、[比較演算](https://go.dev/ref/spec#Comparison_operators)

全プリミティブをVOに変える指示にはしない。単位、取り違え、同じ検証の分散、独立した業務上の意味がある場合に型へ切り出す。DDDガイド§6.8.2（PDF p.72／本文 p.71）も無条件のVO化は求めていない。

**確認条件。** 等価な別インスタンス、値の違うインスタンス、渡したコレクションや返却されたコレクションの変更を試す。Entityは同じID・違う属性と、異なるID・同じ属性を区別する。

## F06：新規生成・状態変更・再構成の契約を分ける

**現状。** [Go原則9行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/go.md:9)に「DB復元時も検証する」とあるが、新規生成との違い、検証する条件、利用を許す呼出し元がない。

**資料。** Go資料§3.3.2（PDF pp.29–30／本文 pp.23–24）は、共通の生成・検証関数を`NewProduct`と`Reconstruct`から使い、新規IDの採番と保存済みIDの保持を区別する。DDDガイド§6.8.3（PDF p.72／本文 p.71）は再構成専用constructorでバリデーションしない方式を説明。FAQ §3.2、§7.2.3（PDF pp.38–40,85–86／本文 pp.37–39,84–85）も再構成の役割・呼出し制限・テストを扱う。**資料間で検証方針は一致していない。**

**影響。** 保存済みの完了タスクを「新規作成時は未完了」の条件で拒否する、ロード時にIDを再発行する、作成時刻や状態を初期化する、といった誤実装を防ぐ指示がない。逆に、復元だから一切検証しないと、保存済みの破損データが業務処理へ入る。

**修正方向。** 次の契約を区別する。

- 新規生成：初期状態、ID・業務日時の決定、作成時だけの条件。
- 状態変更：現在の状態に対する許可された操作と変更後の不変条件。
- 再構成：保存済みの同一性・状態・履歴を保持し、新規作成の副作用を発生させない。

再構成では、常に成立すべき構造・値の条件と、新規作成時だけのルールを区別する。旧版で有効だった値へのルール変更は、互換性・移行・読取失敗時の扱いとして設計する。検証を省く場合は、信頼できるデータの経路と、その前提を守る場所を説明する。

`Reconstruct`の名称固定は不要。通常の更新APIから任意状態を作る抜け道にしないことが重要。GoではJava/Kotlinのprivate constructorをそのまま再現できないため、公開API、package境界、規約や必要な検査で守る範囲を定める。現在のゼロ値・typed nilに関する注意は維持する。

**確認条件。** 新規作成、変更済み状態の再構成、保存→取得の全重要属性の比較、破損・旧版データ、作成副作用の再発生を確認する。時刻やIDを試験で制御する方法は引数または必要最小限の依存として選び、全案件へClock/IDGeneratorのinterfaceを一律追加しない。

## F07：モデリングを「用語と集約を決める」の一文で終わらせない

**現状。** [design-backend 14行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/skills/design-backend/SKILL.md:14)は用語、不変条件、状態遷移、コンテキストと集約を決めるとする。[判断原則9行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/judgment.md:9)には利用者・成功条件を重視する土台がある。しかし、誰からどんな事例を得てモデルを確かめるか、実装中の発見をどう戻すかが手順化されていない。

**資料。** DDDガイド第1–2章、特に§2.4–2.5（PDF pp.35–37／本文 pp.34–36）、FAQ §2.1–2.3（PDF pp.17–33／本文 pp.16–32）は、具体例と抽象モデルを往復し、ドメインエキスパートと共にモデルを改善して、コードへ反映する流れを説明する。

**影響。** エンジニアやモデルが用語の意味・業務ルールを推測して確定し、技術的には動くが業務を表していないクラス群を作る。ADRに設計判断があっても、モデルの意味と実装が離れていく。

**修正方向。** 対象機能と利用者を絞り、正常例・境界例・成立しない例を集め、用語・関係・多重度・状態遷移をモデル化する。事実、仮説、未決事項を区別し、必要な業務確認を行う。日本語とコード上の名称の対応もモデルに結び付ける。実装・テストから新しい発見があれば、モデルとコードを一緒に更新する。

システム関連図、ユースケース図、ドメインモデル図、オブジェクト図は選べる手段として紹介すればよい。FAQ §2.2.1（PDF p.29／本文 p.28）も全種類を常に必須とはしていない。**固定templates、別の用語台帳、全案件必須の図セットを追加する必要はない。** 既存のモデルや管理場所を利用する。

**確認条件。** 業務条件が曖昧な依頼に対し、無根拠に決定せず、具体例から必要な確認を特定できること。モデル変更がDomainの振る舞いと回帰テストへ反映されること。

## F08：責務の選択基準とユースケースの共通化を補う

**現状。** [DDD原則9行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/ddd.md:9)のDomain Serviceの定義は妥当だが、Factoryや集合に関する判断の具体例がない。[構成例27行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/references/architecture.md:27)は循環するユースケース呼出しのみを問題にしており、循環しない深い呼出しやTxの入れ子は説明していない。

**資料。** DDDガイド§6.3–6.5（PDF pp.69–70／本文 pp.68–69）、FAQ §6.1（PDF pp.76–78／本文 pp.75–77）はDomain Service・Factoryの責務を絞る。FAQ §8.6.1（PDF pp.123–124／本文 pp.122–123）はユースケースから別のユースケースを呼ぶ方式を非推奨とし、共通処理を独立させる。Go資料§3.4はDomain Serviceへ永続化を含む注文処理を置く例であり、すべての業務処理を純粋計算へ限定しているわけではない。

**影響。** `UserService`へ登録・退会・照合を詰め込む、Factoryが保存・通知まで行う、ユースケース再利用でTx・認可・副作用が二重になる、といった構造に対する判断が弱い。

**修正方向。** Entity/VOの振る舞いを第一候補とし、自然な所有先がない業務判断をDomain Serviceへ、複雑な生成をFactoryへ、操作の調整・認可・TxをApplicationへ置く。Factoryが別集約を読む必要はあり得るが、保存や通知も同時に担うかは別の責務として判断する。

同一コンテキスト内の共通処理を取り出す場合、業務判断なのかApplicationの取得・変換なのかを先に判定する。公開ユースケースの安易な呼合いは避ける。コンテキスト間の公開Application契約による連携まで全面禁止する必要はなく、そこでの整合性・認可・Txの責任を明示する。

**確認条件。** 複数の入口で同じ業務制約が守られ、公開ユースケースの呼合いを増やさず共通化できること。無条件の`XxxDomainService`や「1 struct 1メソッド」固定規約にはしない。

## F09：Query Serviceを実装へ落とせる説明にする

**現状。** [DDD原則21行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/ddd.md:21)に「単純な参照は専用Query ServiceとDTOでよい」とある。選択制である点はよいが、複数集約に跨る検索での有用性、契約と型の配置、更新系との関係は説明されない。

**資料。** Go資料§4.2（PDF pp.59–62／本文 pp.53–56）、DDDガイド§8.2–8.6（PDF pp.84–91／本文 pp.83–90）は、複数集約に跨るJOIN・絞込・ページング等でQuery Serviceを使い、Applicationに契約・戻り型、外側に取得実装を置く構成を説明する。

**影響。** 複雑な一覧で全集約を復元してアプリ内JOINを行う、部分データを完全な集約に見せかける、画面ごとの情報をDomainへ増やす、といった実装を十分に防げない。

**修正方向。** 単純／複雑だけでなく、集約を復元する意味、検索効率、必要項目、保守負担から使い分ける。QueryのDTOは参照用途の契約として扱い、そのまま更新用集約として保存しない。更新時には必要なDomainの不変条件と競合制御を通す。

Query側にも対象の認可・tenant条件が必要。更新後の一覧表示を保証する必要があれば、その一連の振る舞いを試験する。別DB、レプリカ、Event Sourcingは別の採用判断であり、CQRSの必須要件ではない。全GETにQuery Serviceを新設することも求めない。

**確認条件。** 複数集約を検索する一覧が、正しい層の契約を使い、Domainを不完全に復元せず実装できること。更新結果と参照結果の必要な整合性を確認すること。

## F10：コンテキスト・集約・packageを同一視しない

**現状。** [構成例3行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/references/architecture.md:3)は一つのmodule・プロセスから始める方針で、[DDD原則17行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/ddd.md:17)は他コンテキストの顧客をID参照する。いずれも妥当。ただし、同じコンテキストに複数集約がある場合の参照、package境界による保護、同名概念の意味の違いをどう扱うかが薄い。

**資料。** Go資料§3.3.1（PDF p.27／本文 p.21）は集約ごとのpackageと循環参照のトレードオフを示す。DDDガイド§3.2、§5.7（PDF pp.42–46,64–66／本文 pp.41–45,63–65）はコンテキストごとのモデルの意味と、同一アプリ内での分割を説明。FAQ §8.6.2（PDF p.125／本文 p.124）は共有する型の所有先を曖昧にしないことを扱う。

**影響。** 注文・商品・顧客などの集約を、それぞれ必ず別コンテキストとする過分割、販売と配送の「商品」を万能な共通型にする過度な共有、同じpackage内の別集約から非公開フィールドを操作する境界の破れが起き得る。

**修正方向。** コンテキストは言葉とモデルの適用範囲、集約は内部の整合性を守る単位、packageはGoでの可視性・依存管理の単位として区別する。同じコンテキストの別集約でも、保持する関連はIDを基本とし、判断のために一時的に他集約を渡す場合などの条件を説明する。

Goの非公開識別子はpackage境界で保護され、ファイル単位や集約単位のprivateではない。このため、package配置による制御とレビューで守る内容を分ける。[Go仕様：公開識別子](https://go.dev/ref/spec#Exported_identifiers)

集約ごとのpackageは選択肢とし、既存コードの一律移動は求めない。循環回避のため何でも`shared`に集めず、意味の所有者と公開契約を明らかにする。コンテキスト境界の外部表現は受け取る側のモデルへ変換する。

**確認条件。** 同名で意味が違うモデル、同一コンテキスト内の複数集約、共通値型の3例で、所有先と参照方法を説明できること。

## F11：イベントを採用する案件向けに意味と配送を分ける

**現状。** [reliability原則17行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/principles/reliability.md:17)にoutbox・重複排除の説明があり、[構成例27行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/references/architecture.md:27)はイベントでコンテキスト間を連携できる。業務上の出来事を表すDomainのイベントと、外部へ配送する契約の区別はない。

**資料。** FAQ §5.1（PDF pp.58–73／本文 pp.57–72）は、複数集約をユースケース、Domain Service、Domain Eventで扱う選択肢を比較し、その章の例は同期処理だと明示している。イベントを用いること自体が非同期配送を意味するわけではない。

**影響。** Domain Eventを使うだけで必ずキュー・outbox・非同期処理を追加したり、Domainの内部表現をそのまま外部契約として配信したりする可能性がある。

**修正方向。** イベントを採用する場合に限り、業務上の出来事、同期／非同期の処理、Tx内／commit後の処理、外部公開するpayloadと互換性を区別する。外部配送の耐久性には既存のoutbox・consumer冪等性の指針を適用する。クラウドのキュー作成は別プラグインの責務を維持する。

**確認条件。** 同期のDomain Eventに不要なクラウド構築を追加しないこと。外部配信ではrollbackされた変更を確定した出来事として送らないこと。

これは全案件に必要な新規機構ではない。優先順位はF01–F10より低く、Domain Event frameworkのテンプレート追加も不要。

## F12：DDDの振る舞いを検証する観点と利用評価を足す

**現状。** [testing参照7行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/references/testing.md:7)はDomainの状態遷移・境界値を扱うが、生成／変更／再構成、値の等価性、参照漏出、集約の保存復元などは具体化されていない。[利用シナリオ7行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/evals/scenarios.md:7)からのE01–E15はDB・HTTP・障害・手順遵守に重点があり、DDDの設計判断を直接区別するケースが少ない。

**資料。** FAQ第7章、特に§7.2–7.5（PDF pp.81–101／本文 pp.80–100）は、生成・変更・再構成・VO・ユースケース・Repositoryを責務ごとに試験する。Repositoryでは保存→検索のマッピング項目を確認する。DDDガイド§8.4.3（PDF p.88／本文 p.87）は更新と参照の結合テストも扱う。

**修正方向。** 対象のリスクに応じ、次のような評価ケースを追加する。

| 評価題材 | 確認する判断・振る舞い |
|---|---|
| 非公開sliceを持つVO | constructor引数・getter返却値の変更で内部状態が変わらない |
| 作成時は未完了、DBには完了済みタスク | 再構成でID・状態を保持し、作成時ルールを誤適用しない |
| 部員数によって承認状態が変わる集約 | 子だけの更新でルートの制約を迂回しない |
| 予約の重複確認 | Domain ServiceとRepository契約の所有先、DBによる競合防止を説明する |
| Application DTOを使う正常なHandler | HTTP固有型との違いを判定し、正当なDTOまで禁止しない |
| 商品・所有者を合わせた検索一覧 | Queryの契約・DTOの配置、更新モデルとの分離を説明する |
| 複数集約を同じTxで更新 | 条件付きで許容し、巨大な単一集約へ機械的に統合しない |
| 業務ルールの変更 | モデルの意味、Domainの振る舞い、回帰テストを同時に更新する |

これらは評価用fixtureであり、利用者のプロジェクトへコピーするtemplatesではない。短いプロンプトと必要なコードを評価時に用意し、期待する答えを実行モデルへ先に渡さず判定する。全案件へ全試験を強制しない。

**確認条件。** 静的リンク検査だけで完了とせず、上記の区別をプラグイン利用時に実際に行えることを記録する。Repositoryの保存復元はmockの呼出し確認で代用せず、選択DBで確認する。単純な詰め替えや委譲のすべてに独立テストを増やす必要はなく、FAQ §7.2.3、§7.6.1も価値に応じた省略を認めている。

## 補助的な整理

指摘一覧の12件とは別に、次の小さな整理が有用。

- **用語の対応。** FAQ §8.6.5（PDF pp.126–127／本文 pp.125–126）はCAのEntities層とDDDのEntityを別概念とする。短い対応表を追加すれば、DomainにVOやDomain Serviceが含まれる理由を説明できる。全層をCAの図と同じ名前へ改名する必要はない。
- **不要なDB手順の文言。** [PostgreSQLスキル15行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/skills/postgresql-backend/SKILL.md:15)と[MySQLスキル15行](/Users/k-taiga/Developer/cursor-plugin/plugins/backend-chief/skills/mysql-backend/SKILL.md:15)にNoSQL製品確定の説明が重複している。直ちに全NoSQL導入を指示する文ではないが、対象DB専用スキルとしては不要な分岐なので整理できる。
- **参照元の区分。** 添付資料を今後プラグインへ反映する場合、資料名・版・採用した考え方をsourcesに残す。配布プラグインが利用者のDownloads配下やPDF原本の存在に依存しないよう、必要な判断を独立した文章として記述する。個別著者の選択を公式仕様と呼ばない。
- **version・業務日時。** FAQ §3.3（PDF pp.42–45／本文 pp.41–44）はORMによる自動値と、Domain上の日時・楽観ロック情報を区別している。現在の`expectedVersion`引数方式は誤りではないが、ロードした状態と期待versionを対応させる方法、業務日時とDB更新日時の違いは構成例に補足できる。

## 過剰として削る必要がない内容

以下は資料にない、または資料より厳しいという理由だけでは削除しない。

| 現状の方針 | 判定と理由 |
|---|---|
| PostgreSQL・MySQL・NoSQLを選択制にする | 維持。利用者の明示要件。全製品共通の原子性を約束しないことも妥当 |
| GinをAdapterへ閉じ込め、Request.Contextを渡す | 維持。入力と依存の境界を守る。Go資料のサンプル呼出しと同一である必要はない |
| ApplicationがTx境界、Adapterが実装を所有する | 維持。Go資料§4.1と一致する。Tx管理までDomainへ移さない |
| callbackでTxに紐付いたportを渡す | 維持可能。資料のcontextによる伝播方式は必須ではない |
| DB制約・条件付き更新・実DBテスト | 維持。メモリ上で正しいDomainだけでは、別リクエストとの競合は保証できない |
| キャンセル、goroutineの回収・並列数、停止再開 | 維持。バックエンドプログラムとしての責務。クラウド資源作成とは別 |
| outbox・冪等性・重複配送対策 | 必要な機能で維持。DDD入門資料の説明範囲外でも、耐久的な副作用を扱う案件には必要 |
| HTTP DTO／DB型／Domain型の分離 | 維持。修正対象はApplication DTOまで禁じるように読めるF02の文言 |
| CQRS・別DB・Event Sourcingを必須にしない | 維持。DDDガイド§8.4–8.5とも整合する |
| 全structにinterfaceを作らない | 維持。ただしinterfaceは将来の差替えだけでなく、依存方向を制御する目的でも必要 |
| 一つのmodule・プロセスから始める | 維持。DDDガイド§5.7は複数コンテキストを一つのアプリ内に置く方式も認める |
| Controller／Presenter専用の分割を強制しない | 維持。Go資料PDF p.52／本文 p.46も任意の実装パターンとして扱う |
| 固定templatesを配らず、既存構成・記録・検査を利用する | 維持。資料は固定のファイルセットの配布を要求していない |
| Google Cloud等の資源作成を別プラグインへ分離する | 維持。利用者の明示した責務境界 |

したがって、過剰な部分は「DB・障害対応の内容が多いこと」自体ではなく、F01の配置の限定、F02の禁止の広さ、F03の境界を同一視させる表現にある。DDDの説明を厚くするために既存の実運用上の判断を薄くする必要はない。

## 資料をそのまま規約・コードにしない理由

### 資料内・資料間の設計選択

再構成時の検証についてはF06の通り差がある。Domain ServiceがRepositoryを使うか、Domainオブジェクトをユースケースから返すか、集約を跨ぐTxを許すかも、資料中に条件や見解の幅がある。

また、DDDガイドのモデリングツールの推奨とFAQの推奨は異なる。これは著者の経験と時点によるもので、特定ツールをプラグインの必須依存にする根拠にはならない。Goのサンプルで使われるIDライブラリ、sqlc、mockライブラリ、Swagger生成方法も個別の採用例として扱う。

### サンプルコードの注意点

以下はプラグインの不具合ではなく、資料を機械的にコピーしないための確認事項。PDF記載コードの静的な読解に基づくもので、著者のリポジトリの現行実装や訂正状況を検証した主張ではない。

- Go資料PDF p.37／本文 p.31では、商品mapの検索結果について、存在を示す`ok`の確認より先に`p.Price()`を呼んでいる。商品がないときのメソッド呼出しが先行するため、不存在処理の順序はそのまま模倣しない。
- Go資料PDF pp.57–59／本文 pp.51–53には、contextにTx用queryがなければ通常のqueryへ戻る例がある。現在のプラグインがTx外poolへの漏れを禁止することは妥当。Go公式も取引中に非TxのDB操作を混ぜる問題を説明している。[Go公式：トランザクション](https://go.dev/doc/database/execute-transactions)
- Go資料PDF pp.64–65／本文 pp.58–59のgoroutine例はチャンクごとに起動して待機し、recover時はログを出している。処理全体の並列数上限や、panicした処理を成功と報告しないエラーの扱いは、実アプリでは別途必要。現在の回収・並列数・失敗の扱いを弱めない。

## 推奨する修正順と配置

1. **文書の意味を揃える。** F01–F04をarchitecture／persistence／ddd／gin／review-checklistに反映し、design・implementの誘導も合わせる。
2. **Domainの設計・実装判断を足す。** F05–F10をDDDとGoの原則、および必要なら目的別の参照資料へまとめる。入口のSKILLを巨大な教科書にしない。
3. **必要な案件向けの判断を補う。** イベント、version、日時、CAとDDDの用語差を該当箇所から参照できるようにする。
4. **使った時の振る舞いを確かめる。** F12の評価ケースを加え、文書validatorに加えて、誤実装と妥当な別案を区別できるか確認する。

新しいスキルやディレクトリを必須とはしない。既存のpstack／frontend-chiefに倣った「入口→工程→原則・参照→評価」の構成を保ったまま、判断を具体化できる。利用者へ定型文書・コードのコピーを要求するtemplatesは再導入しない。

## 実行した検査と調査の限界

| 検査 | 結果 |
|---|---|
| `node plugins/backend-chief/scripts/validate-content.ts plugins/backend-chief` | 成功：frontmatter・ローカルリンク・スキル到達性 |
| `node --test plugins/backend-chief/scripts/validate-content.test.ts` | 5件成功 |
| PDF本文 | 全3ファイルを抽出。DDD2資料の初回文字化けはPopplerで再抽出して解消 |
| 画像確認 | Go資料PDF pp.18,30,37,61、DDDガイドPDF p.40、FAQ PDF pp.74,124の本文・図・コード |
| 実アプリ生成・各DB接続・Cursor上でのシナリオ実行 | 今回は未実行 |

validator成功は、文書の技術的・意味的な正しさを証明しない。今回の指摘はプラグインの記述と参照資料の照合結果であり、生成アプリで同じ不具合が必ず再現すると確認したものではない。資料だけでは決められない業務上の境界・不変条件は、汎用プラグインで固定せず実案件の判断として残す。

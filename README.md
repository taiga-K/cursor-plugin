# Cursor plugin template

Build and publish Cursor Marketplace plugins from a single repo.

## Frontend Chief

[frontend-chief](plugins/frontend-chief/README.md) は、TypeScript・Next.js App Router・FSD・Atomic Design・Astryxを採用するフロントエンド向けプラグインです。画面とNext.js内のBFFについて、チーフエンジニアの判断原則、作業手順、検証支援を提供します。

防護は次の順です。(1) 型とアーキテクチャ (2) 静的解析・CI・テスト（証拠の正本は CI） (3) スキルとルール (4) 人間のプロンプト。フックで lint/test を代替しません。検証基盤は `setup-frontend` / `update-frontend` で導入・追従します。

入口は `/frontend-chief`。Astryx公式のMCPサーバーを同梱し、UI部品の選定はMCPの検索と比較を前提にします。詳しい使い方はプラグインのREADMEを参照してください。

```sh
node scripts/validate-template.mjs
node plugins/frontend-chief/scripts/validate-content.ts
node --test plugins/frontend-chief/scripts/validate-content.test.ts
```

## Getting started

[Use this template](https://github.com/cursor/plugin-template/generate) to create a new repository, then customize:

1. `.cursor-plugin/marketplace.json`: set marketplace `name`, `owner`, and `metadata`.
2. `plugins/*/.cursor-plugin/plugin.json`: set `name` (lowercase kebab-case), `displayName`, `author`, `description`, `keywords`, `license`, and `version`.
3. Replace placeholder rules, skills, agents, commands, hooks, scripts, and logos.

To add more plugins, see `docs/add-a-plugin.md`.

## Single plugin vs multi-plugin

This template defaults to **multi-plugin** (multiple plugins in one repo).

For a **single plugin**, move your plugin folder contents to the repository root, keep one `.cursor-plugin/plugin.json`, and remove `.cursor-plugin/marketplace.json`.

## Submission checklist

- Each plugin has a valid `.cursor-plugin/plugin.json`.
- Plugin names are unique, lowercase, and kebab-case.
- `.cursor-plugin/marketplace.json` entries map to real plugin folders.
- All frontmatter metadata is present in rule, skill, agent, and command files.
- Logos are committed and referenced with relative paths.
- `node scripts/validate-template.mjs` passes.
- Repository link is ready for submission to the Cursor team (Slack or `kniparko@anysphere.com`).

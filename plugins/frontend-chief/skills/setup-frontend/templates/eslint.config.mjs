// Target: ESLint 9 flat config + eslint-config-next + typescript-eslint.
// Verified: 2026-09-12. Merge with the app's existing eslint.config; do not wipe project rules.
// Next.js 15: FlatCompat + next/core-web-vitals (this file).
// Next.js 16+: replace compat.extends with flat imports:
//   import nextVitals from "eslint-config-next/core-web-vitals";
//   import nextTs from "eslint-config-next/typescript";
//   ...nextVitals, ...nextTs
// jsx-a11y recommended ships with core-web-vitals — do not re-register it.
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "storybook-static/**",
      "public/**",
      "next-env.d.ts",
      "steiger.config.ts",
      "playwright.config.ts",
      "vitest.config.ts",
      ".storybook/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "react/forbid-dom-props": ["error", { forbid: ["style"] }],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@astryxdesign/core",
              message: "Import from a subpath entry (e.g. @astryxdesign/core/Button), not the package root.",
            },
          ],
        },
      ],
    },
  },
);

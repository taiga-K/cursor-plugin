# Target scripts for package.json. Verified: 2026-09-12.
# Merge into existing scripts. Prefer pnpm. `verify` must match CI.
#
# "typecheck": "tsc --noEmit"
# "lint": "eslint ."
# "architecture": "steiger src"
# "test": "vitest run"
# "check-stories": "node scripts/check-stories.mjs"
# "verify": "pnpm typecheck && pnpm lint && pnpm architecture && pnpm check-stories && pnpm test"
# "build": "next build"
# "test:e2e": "playwright test"
# "test:e2e:update-snapshots": "playwright test --update-snapshots"
#
# Suggested devDependencies (pin to versions compatible with the app's Next.js):
# typescript, typescript-eslint, eslint, eslint-config-next, @eslint/eslintrc,
# steiger, @feature-sliced/steiger-plugin,
# vitest, @vitest/browser, @vitest/browser-playwright, playwright, @playwright/test, @axe-core/playwright,
# @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom,
# msw, msw-storybook-addon@3 (use msw-storybook-addon/csf3; run `pnpm exec msw init public --save`),
# storybook, @storybook/nextjs-vite, @storybook/addon-vitest, @storybook/addon-a11y,
# eslint-plugin-jsx-a11y comes via eslint-config-next (core-web-vitals); do not re-register it,
# server-only, zod

// EXAMPLE ONLY — do not enable until the route exists. Adapt the path.
// Rename to *.spec.ts after updating page.goto targets.
// axe accessibility scan fixture. Verified: 2026-09-12.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("orders page has no serious axe violations", async ({ page }) => {
  await page.goto("/orders");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

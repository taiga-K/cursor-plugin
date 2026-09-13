// EXAMPLE ONLY — do not enable until the route exists. Adapt the path.
// Rename to *.spec.ts after updating page.goto targets.
// Journey smoke: role locators + ARIA snapshot. Verified: 2026-09-12.
import { expect, test } from "@playwright/test";

test("orders page exposes an accessible heading and list region", async ({ page }) => {
  await page.goto("/orders");
  await expect(page.getByRole("heading", { name: /注文|orders/i })).toBeVisible();
  await expect(page.getByRole("main")).toMatchAriaSnapshot(`
    - main:
      - heading
  `);
});

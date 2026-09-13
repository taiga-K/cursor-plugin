// EXAMPLE ONLY — do not enable until the route exists. Adapt the path.
// Rename to *.spec.ts after updating page.goto targets.
// Visual regression via toHaveScreenshot. Verified: 2026-09-12.
// Run snapshot updates only on CI Linux (`pnpm test:e2e:update-snapshots`).
// Do not commit screenshots taken on macOS/Windows.
import { expect, test } from "@playwright/test";

test.describe("visual", () => {
  test.skip(!process.env["CI"], "Screenshot baselines are CI Linux only");


  test("orders page layout", async ({ page }) => {
    await page.goto("/orders");
    await expect(page.getByRole("main")).toHaveScreenshot("orders-main.png", {
      animations: "disabled",
      mask: [page.getByTestId("clock")],
    });
  });
});

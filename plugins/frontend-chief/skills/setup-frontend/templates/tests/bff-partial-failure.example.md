# Example only — do NOT copy into a path matched by Vitest `*.test.ts`.
# Verified: 2026-09-12. Wire to the real BFF loader before enabling as a test.
#
# Suggested file once real: `src/**/load-summary.test.ts` (or adjacent to the module).
#
# ```ts
# import { http, HttpResponse } from "msw";
# import { describe, expect, it } from "vitest";
# import { server } from "@/tests/msw/node";
# import { loadSummary } from "./load-summary";
#
# describe("loadSummary partial failure", () => {
#   it("keeps required orders when recommendations fail", async () => {
#     server.use(
#       http.get("/api/orders", () =>
#         HttpResponse.json([{ id: "1", label: "キーボード" }]),
#       ),
#       http.get("/api/recommendations", () =>
#         HttpResponse.json({ message: "timeout" }, { status: 504 }),
#       ),
#     );
#
#     const summary = await loadSummary();
#     expect(summary).toMatchObject({
#       status: "degraded",
#       orders: [{ id: "1", label: "キーボード" }],
#     });
#     expect(summary.status === "degraded" && summary.errors).toEqual(
#       expect.arrayContaining([expect.objectContaining({ source: "recommendations" })]),
#     );
#   });
# });
# ```
#
# Do not leave `expect(true).toBe(true)` in a runnable test. That is a false green.

// Shared MSW handlers. Extend per feature. Verified: 2026-09-12.
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/orders", () =>
    HttpResponse.json([
      { id: "1", label: "キーボード" },
    ]),
  ),
];

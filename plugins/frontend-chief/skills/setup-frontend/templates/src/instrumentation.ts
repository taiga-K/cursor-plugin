// Enable MSW on the Next.js server when NEXT_PUBLIC_API_MOCKING=enabled.
// Verified: 2026-09-12. Never enable in production builds.
export async function register() {
  if (process.env["NEXT_RUNTIME"] !== "nodejs") return;
  if (process.env["NEXT_PUBLIC_API_MOCKING"] !== "enabled") return;

  const { server } = await import("../tests/msw/node");
  server.listen({ onUnhandledRequest: "error" });
}

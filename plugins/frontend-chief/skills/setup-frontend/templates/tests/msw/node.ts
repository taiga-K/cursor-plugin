// MSW for Vitest / Node. Verified: 2026-09-12.
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

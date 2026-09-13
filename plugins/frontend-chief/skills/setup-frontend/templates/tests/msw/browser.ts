// MSW for browser / Storybook. Verified: 2026-09-12.
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

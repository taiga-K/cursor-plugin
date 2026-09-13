// Target: steiger + @feature-sliced/steiger-plugin recommended.
// Verified: 2026-09-12. Add migration exceptions only as narrow path overrides with reasons.
import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
]);

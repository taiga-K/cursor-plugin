// Storybook main for Next.js + Vitest addon + a11y. Verified: 2026-09-12.
// Storybook 9+/10: do not set docs.autodocs (removed). Prefer tags: ["autodocs"] on stories/preview.
import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest", "msw-storybook-addon"],
  framework: "@storybook/nextjs-vite",
};

export default config;

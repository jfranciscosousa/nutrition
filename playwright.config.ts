import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    command: "MODE=e2e npm run build && npm run preview",
    port: 4173,
  },
  testDir: "tests",
};

export default config;

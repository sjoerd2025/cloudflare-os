import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import capnwebValidate from "capnweb-validate/vite";
import { defineConfig } from "vitest/config";
import deployed from "./cloudflare.config.ts";

const { compatibilityDate, compatibilityFlags } = deployed.worker;

/** Workerd coverage for Google resource configurators, Gmail sessions, and the Gmail Durable Object. */
export default defineConfig({
  plugins: [
    capnwebValidate(),
    cloudflareTest({
      main: "./__tests__/workerd/worker.ts",
      miniflare: {
        compatibilityDate,
        compatibilityFlags,
        bindings: {CLIENT_ID: "test-client", CLIENT_SECRET: "test-secret"},
        durableObjects: {
          GmailGatekeeperImpl: {className: "GmailGatekeeperImpl", useSQLite: true},
          TestHooks: {className: "TestHooks", useSQLite: true},
          UserAccount: {className: "UserAccount", useSQLite: true},
        },
      },
    }),
  ],
  test: {
    include: [
      "__tests__/workerd/configurators.test.ts",
      "__tests__/workerd/gmail-actions.test.ts",
      "__tests__/workerd/gmail-state.test.ts",
    ],
    setupFiles: ["@gadgets/scripts/assert-workerd"],
  },
});

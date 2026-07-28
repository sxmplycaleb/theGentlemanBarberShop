import { afterEach, describe, expect, it, vi } from "vitest";

describe("environment validation", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("accepts a valid public app URL", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com");

    const { publicEnvironment } = await import("@/config/env");

    expect(publicEnvironment.NEXT_PUBLIC_APP_URL).toBe("https://example.com");
  });

  it("rejects a malformed public app URL", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "not-a-url");

    await expect(import("@/config/env")).rejects.toThrow();
  });
});

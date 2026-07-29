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

  it("accepts Clerk keys and redirect paths", async () => {
    vi.resetModules();
    vi.stubEnv("CLERK_SECRET_KEY", "sk_test_valid-secret");
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_valid-public");
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_IN_URL", "/sign-in");
    vi.stubEnv("NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL", "/account");

    const { publicEnvironment, serverEnvironment } =
      await import("@/config/env");

    expect(publicEnvironment.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY).toBe(
      "pk_test_valid-public",
    );
    expect(publicEnvironment.NEXT_PUBLIC_CLERK_SIGN_IN_URL).toBe("/sign-in");
    expect(
      publicEnvironment.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
    ).toBe("/account");
    expect(serverEnvironment.CLERK_SECRET_KEY).toBe("sk_test_valid-secret");
  });

  it("accepts Supabase database configuration", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "valid-anon-key");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "valid-service-role-key");

    const { publicEnvironment, serverEnvironment } =
      await import("@/config/env");

    expect(publicEnvironment.NEXT_PUBLIC_SUPABASE_URL).toBe(
      "https://project.supabase.co",
    );
    expect(publicEnvironment.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(
      "valid-anon-key",
    );
    expect(serverEnvironment.SUPABASE_SERVICE_ROLE_KEY).toBe(
      "valid-service-role-key",
    );
  });

  it("rejects a malformed public app URL", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "not-a-url");

    await expect(import("@/config/env")).rejects.toThrow();
  });

  it("rejects malformed Clerk keys", async () => {
    vi.resetModules();
    vi.stubEnv("CLERK_SECRET_KEY", "secret");
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "public");

    await expect(import("@/config/env")).rejects.toThrow();
  });

  it("rejects a malformed Supabase URL", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "not-a-url");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "valid-anon-key");

    await expect(import("@/config/env")).rejects.toThrow();
  });

  it("requires Clerk keys in production", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");

    await expect(import("@/config/env")).rejects.toThrow(
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required in production.",
    );
  });

  it("requires the Clerk server secret in production", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_live_valid-public");

    await expect(import("@/config/env")).rejects.toThrow(
      "CLERK_SECRET_KEY is required in production.",
    );
  });

  it("requires Supabase configuration in production", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_live_valid-public");
    vi.stubEnv("CLERK_SECRET_KEY", "sk_live_valid-secret");

    await expect(import("@/config/env")).rejects.toThrow(
      "NEXT_PUBLIC_SUPABASE_URL is required in production.",
    );
  });
});

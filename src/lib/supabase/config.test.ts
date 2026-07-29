import { afterEach, describe, expect, it, vi } from "vitest";

describe("Supabase configuration", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("reports when Supabase is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "valid-anon-key");

    const { isSupabaseConfigured } = await import("@/lib/supabase/config");

    expect(isSupabaseConfigured()).toBe(true);
  });

  it("returns the database configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "valid-anon-key");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "valid-service-role-key");

    const { getSupabaseDatabaseConfig } = await import("@/lib/supabase/config");

    expect(getSupabaseDatabaseConfig()).toEqual({
      anonKey: "valid-anon-key",
      serviceRoleKey: "valid-service-role-key",
      url: "https://project.supabase.co",
    });
  });

  it("fails fast when database access is requested without configuration", async () => {
    const { getSupabaseDatabaseConfig } = await import("@/lib/supabase/config");

    expect(() => getSupabaseDatabaseConfig()).toThrow(
      "NEXT_PUBLIC_SUPABASE_URL is required for database access.",
    );
  });
});

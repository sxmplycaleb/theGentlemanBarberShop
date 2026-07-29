import { afterEach, describe, expect, it, vi } from "vitest";

const supabaseMocks = vi.hoisted(() => ({
  createClient: vi.fn(() => ({ client: "supabase" })),
}));

vi.mock("server-only", () => ({}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: supabaseMocks.createClient,
}));

describe("Supabase server client", () => {
  afterEach(() => {
    supabaseMocks.createClient.mockClear();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("creates a server client with the anon key by default", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "valid-anon-key");

    const { createSupabaseServerClient } =
      await import("@/lib/supabase/server");

    expect(createSupabaseServerClient()).toEqual({ client: "supabase" });
    expect(supabaseMocks.createClient).toHaveBeenCalledWith(
      "https://project.supabase.co",
      "valid-anon-key",
      {
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: false,
          persistSession: false,
        },
      },
    );
  });

  it("creates a service-role client only when the server key is available", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "valid-anon-key");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "valid-service-role-key");

    const { createSupabaseServerClient } =
      await import("@/lib/supabase/server");

    createSupabaseServerClient({ serviceRole: true });

    expect(supabaseMocks.createClient).toHaveBeenCalledWith(
      "https://project.supabase.co",
      "valid-service-role-key",
      expect.any(Object),
    );
  });

  it("fails fast when service-role access is requested without the server key", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "valid-anon-key");

    const { createSupabaseServerClient } =
      await import("@/lib/supabase/server");

    expect(() => createSupabaseServerClient({ serviceRole: true })).toThrow(
      "SUPABASE_SERVICE_ROLE_KEY is required for service-role database access.",
    );
  });
});

import { publicEnvironment, serverEnvironment } from "@/config/env";

export type SupabaseDatabaseConfig = {
  readonly anonKey: string;
  readonly serviceRoleKey?: string;
  readonly url: string;
};

export function isSupabaseConfigured() {
  return Boolean(
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL &&
    publicEnvironment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getSupabaseDatabaseConfig(): SupabaseDatabaseConfig {
  const url = publicEnvironment.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = publicEnvironment.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is required for database access.",
    );
  }

  if (!anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is required for database access.",
    );
  }

  const config: SupabaseDatabaseConfig = {
    anonKey,
    url,
  };

  if (serverEnvironment.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      ...config,
      serviceRoleKey: serverEnvironment.SUPABASE_SERVICE_ROLE_KEY,
    };
  }

  return config;
}

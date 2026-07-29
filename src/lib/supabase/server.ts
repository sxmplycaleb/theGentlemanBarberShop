import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseDatabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

type SupabaseServerClientOptions = {
  readonly serviceRole?: boolean;
};

export function createSupabaseServerClient(
  options: SupabaseServerClientOptions = {},
) {
  const config = getSupabaseDatabaseConfig();
  const key = options.serviceRole ? config.serviceRoleKey : config.anonKey;

  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for service-role database access.",
    );
  }

  return createClient<Database>(config.url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

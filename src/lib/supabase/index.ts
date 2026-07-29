export {
  getSupabaseDatabaseConfig,
  isSupabaseConfigured,
  type SupabaseDatabaseConfig,
} from "@/lib/supabase/config";
export type { Database, Json } from "@/lib/supabase/database.types";
export { createSupabaseServerClient } from "@/lib/supabase/server";

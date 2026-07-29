export type Json =
  | boolean
  | null
  | number
  | string
  | Json[]
  | { readonly [key: string]: Json | undefined };

export type Database = {
  readonly public: {
    readonly Tables: Record<string, never>;
    readonly Views: Record<string, never>;
    readonly Functions: Record<string, never>;
    readonly Enums: Record<string, never>;
    readonly CompositeTypes: Record<string, never>;
  };
};

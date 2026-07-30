export type Json =
  | boolean
  | null
  | number
  | string
  | Json[]
  | { readonly [key: string]: Json | undefined };

export type Database = {
  readonly public: {
    readonly Tables: {
      readonly business_settings: {
        readonly Row: {
          readonly business_name: string;
          readonly created_at: string;
          readonly currency_code: string;
          readonly id: boolean;
          readonly timezone: string;
          readonly updated_at: string;
        };
        readonly Insert: {
          readonly business_name: string;
          readonly created_at?: string;
          readonly currency_code?: string;
          readonly id?: boolean;
          readonly timezone?: string;
          readonly updated_at?: string;
        };
        readonly Update: {
          readonly business_name?: string;
          readonly created_at?: string;
          readonly currency_code?: string;
          readonly id?: boolean;
          readonly timezone?: string;
          readonly updated_at?: string;
        };
        readonly Relationships: [];
      };
      readonly customers: {
        readonly Row: {
          readonly created_at: string;
          readonly deleted_at: string | null;
          readonly email: string | null;
          readonly full_name: string;
          readonly id: string;
          readonly is_active: boolean;
          readonly notes: string | null;
          readonly phone_number: string | null;
          readonly updated_at: string;
        };
        readonly Insert: {
          readonly created_at?: string;
          readonly deleted_at?: string | null;
          readonly email?: string | null;
          readonly full_name: string;
          readonly id?: string;
          readonly is_active?: boolean;
          readonly notes?: string | null;
          readonly phone_number?: string | null;
          readonly updated_at?: string;
        };
        readonly Update: {
          readonly created_at?: string;
          readonly deleted_at?: string | null;
          readonly email?: string | null;
          readonly full_name?: string;
          readonly id?: string;
          readonly is_active?: boolean;
          readonly notes?: string | null;
          readonly phone_number?: string | null;
          readonly updated_at?: string;
        };
        readonly Relationships: [];
      };
      readonly service_categories: {
        readonly Row: {
          readonly created_at: string;
          readonly deleted_at: string | null;
          readonly description: string | null;
          readonly display_order: number;
          readonly id: string;
          readonly is_active: boolean;
          readonly name: string;
          readonly slug: string;
          readonly updated_at: string;
        };
        readonly Insert: {
          readonly created_at?: string;
          readonly deleted_at?: string | null;
          readonly description?: string | null;
          readonly display_order?: number;
          readonly id?: string;
          readonly is_active?: boolean;
          readonly name: string;
          readonly slug: string;
          readonly updated_at?: string;
        };
        readonly Update: {
          readonly created_at?: string;
          readonly deleted_at?: string | null;
          readonly description?: string | null;
          readonly display_order?: number;
          readonly id?: string;
          readonly is_active?: boolean;
          readonly name?: string;
          readonly slug?: string;
          readonly updated_at?: string;
        };
        readonly Relationships: [];
      };
      readonly services: {
        readonly Row: {
          readonly category_id: string;
          readonly created_at: string;
          readonly deleted_at: string | null;
          readonly description: string | null;
          readonly display_order: number;
          readonly duration_minutes: number;
          readonly id: string;
          readonly image_url: string | null;
          readonly is_active: boolean;
          readonly name: string;
          readonly price_cents: number;
          readonly slug: string;
          readonly updated_at: string;
        };
        readonly Insert: {
          readonly category_id: string;
          readonly created_at?: string;
          readonly deleted_at?: string | null;
          readonly description?: string | null;
          readonly display_order?: number;
          readonly duration_minutes: number;
          readonly id?: string;
          readonly image_url?: string | null;
          readonly is_active?: boolean;
          readonly name: string;
          readonly price_cents: number;
          readonly slug: string;
          readonly updated_at?: string;
        };
        readonly Update: {
          readonly category_id?: string;
          readonly created_at?: string;
          readonly deleted_at?: string | null;
          readonly description?: string | null;
          readonly display_order?: number;
          readonly duration_minutes?: number;
          readonly id?: string;
          readonly image_url?: string | null;
          readonly is_active?: boolean;
          readonly name?: string;
          readonly price_cents?: number;
          readonly slug?: string;
          readonly updated_at?: string;
        };
        readonly Relationships: [
          {
            readonly foreignKeyName: "services_category_id_fkey";
            readonly columns: ["category_id"];
            readonly isOneToOne: false;
            readonly referencedRelation: "service_categories";
            readonly referencedColumns: ["id"];
          },
        ];
      };
      readonly staff: {
        readonly Row: {
          readonly bio: string | null;
          readonly created_at: string;
          readonly deleted_at: string | null;
          readonly display_name: string;
          readonly display_order: number;
          readonly id: string;
          readonly is_active: boolean;
          readonly phone_number: string | null;
          readonly slug: string;
          readonly updated_at: string;
        };
        readonly Insert: {
          readonly bio?: string | null;
          readonly created_at?: string;
          readonly deleted_at?: string | null;
          readonly display_name: string;
          readonly display_order?: number;
          readonly id?: string;
          readonly is_active?: boolean;
          readonly phone_number?: string | null;
          readonly slug: string;
          readonly updated_at?: string;
        };
        readonly Update: {
          readonly bio?: string | null;
          readonly created_at?: string;
          readonly deleted_at?: string | null;
          readonly display_name?: string;
          readonly display_order?: number;
          readonly id?: string;
          readonly is_active?: boolean;
          readonly phone_number?: string | null;
          readonly slug?: string;
          readonly updated_at?: string;
        };
        readonly Relationships: [];
      };
    };
    readonly Views: Record<string, never>;
    readonly Functions: Record<string, never>;
    readonly Enums: Record<string, never>;
    readonly CompositeTypes: Record<string, never>;
  };
};

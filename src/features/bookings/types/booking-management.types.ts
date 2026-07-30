import type { SupabaseClient } from "@supabase/supabase-js";

import type { PaginationMeta } from "@/components/management/pagination";
import type { Database } from "@/lib/supabase/database.types";

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type BookingRow = {
  readonly booking_date: string;
  readonly created_at: string;
  readonly customer_id: string;
  readonly deleted_at: string | null;
  readonly id: string;
  readonly service_id: string;
  readonly staff_id: string;
  readonly start_time: string;
  readonly status: BookingStatus;
  readonly updated_at: string;
};

type BookingInsert = {
  readonly booking_date: string;
  readonly created_at?: string;
  readonly customer_id: string;
  readonly deleted_at?: string | null;
  readonly id?: string;
  readonly service_id: string;
  readonly staff_id: string;
  readonly start_time: string;
  readonly status?: BookingStatus;
  readonly updated_at?: string;
};

type BookingUpdate = Partial<BookingInsert>;

export type BookingDatabase = {
  readonly public: Omit<Database["public"], "Tables"> & {
    readonly Tables: Database["public"]["Tables"] & {
      readonly bookings: {
        readonly Row: BookingRow;
        readonly Insert: BookingInsert;
        readonly Update: BookingUpdate;
        readonly Relationships: [
          {
            readonly foreignKeyName: "bookings_customer_id_fkey";
            readonly columns: ["customer_id"];
            readonly isOneToOne: false;
            readonly referencedRelation: "customers";
            readonly referencedColumns: ["id"];
          },
          {
            readonly foreignKeyName: "bookings_service_id_fkey";
            readonly columns: ["service_id"];
            readonly isOneToOne: false;
            readonly referencedRelation: "services";
            readonly referencedColumns: ["id"];
          },
          {
            readonly foreignKeyName: "bookings_staff_id_fkey";
            readonly columns: ["staff_id"];
            readonly isOneToOne: false;
            readonly referencedRelation: "staff";
            readonly referencedColumns: ["id"];
          },
        ];
      };
    };
  };
};

export type BookingSupabaseClient = SupabaseClient<BookingDatabase>;

export type BookingCustomer = {
  readonly deleted_at: string | null;
  readonly full_name: string;
  readonly id: string;
  readonly is_active: boolean;
};

export type BookingStaff = {
  readonly deleted_at: string | null;
  readonly display_name: string;
  readonly id: string;
  readonly is_active: boolean;
};

export type BookingService = {
  readonly deleted_at: string | null;
  readonly id: string;
  readonly is_active: boolean;
  readonly name: string;
};

export type BookingWithRelations = BookingRow & {
  readonly customer: BookingCustomer | null;
  readonly service: BookingService | null;
  readonly staff: BookingStaff | null;
};

export type BookingSelectionOptions = {
  readonly customers: readonly BookingCustomer[];
  readonly services: readonly BookingService[];
  readonly staff: readonly BookingStaff[];
};

export type DeletedFilter = "all" | "deleted" | "not-deleted";
export type SortDirection = "asc" | "desc";
export type BookingSortField =
  "booking_date" | "created_at" | "start_time" | "status" | "updated_at";

export type PaginatedResult<TRow> = {
  readonly data: readonly TRow[];
  readonly pagination: PaginationMeta;
};

export type BookingListFilters = {
  readonly customerId: string;
  readonly dateFrom: string;
  readonly dateTo: string;
  readonly deleted: DeletedFilter;
  readonly direction: SortDirection;
  readonly page: number;
  readonly pageSize: number;
  readonly search: string;
  readonly serviceId: string;
  readonly sort: BookingSortField;
  readonly staffId: string;
  readonly status: BookingStatus | "all";
};

export type BookingManagementSearchParams = {
  readonly customer?: string | readonly string[];
  readonly date_from?: string | readonly string[];
  readonly date_to?: string | readonly string[];
  readonly deleted?: string | readonly string[];
  readonly direction?: string | readonly string[];
  readonly page?: string | readonly string[];
  readonly search?: string | readonly string[];
  readonly service?: string | readonly string[];
  readonly sort?: string | readonly string[];
  readonly staff?: string | readonly string[];
  readonly status?: string | readonly string[];
};

export type ActionState = {
  readonly errors?: Record<string, readonly string[]>;
  readonly message?: string;
  readonly success: boolean;
};

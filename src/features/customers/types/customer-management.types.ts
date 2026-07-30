import type { PaginationMeta } from "@/components/management/pagination";
import type { Database } from "@/lib/supabase/database.types";

export type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];

export type DeletedFilter = "all" | "deleted" | "not-deleted";
export type ActiveFilter = "active" | "all" | "inactive";
export type SortDirection = "asc" | "desc";

export type CustomerSortField =
  "created_at" | "full_name" | "is_active" | "updated_at";

export type PaginatedResult<TRow> = {
  readonly data: readonly TRow[];
  readonly pagination: PaginationMeta;
};

export type CustomerListFilters = {
  readonly active: ActiveFilter;
  readonly deleted: DeletedFilter;
  readonly direction: SortDirection;
  readonly page: number;
  readonly pageSize: number;
  readonly search: string;
  readonly sort: CustomerSortField;
};

export type CustomerManagementSearchParams = {
  readonly active?: string | readonly string[];
  readonly deleted?: string | readonly string[];
  readonly direction?: string | readonly string[];
  readonly page?: string | readonly string[];
  readonly search?: string | readonly string[];
  readonly sort?: string | readonly string[];
};

export type ActionState = {
  readonly errors?: Record<string, readonly string[]>;
  readonly message?: string;
  readonly success: boolean;
};

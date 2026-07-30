import type { Database } from "@/lib/supabase/database.types";

export type ServiceCategoryRow =
  Database["public"]["Tables"]["service_categories"]["Row"];

export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

export type ServiceWithCategory = ServiceRow & {
  readonly category: Pick<
    ServiceCategoryRow,
    "deleted_at" | "id" | "name" | "slug"
  > | null;
};

export type DeletedFilter = "all" | "deleted" | "not-deleted";

export type ActiveFilter = "active" | "all" | "inactive";

export type SortDirection = "asc" | "desc";

export type CategorySortField =
  "created_at" | "display_order" | "is_active" | "name" | "updated_at";

export type ServiceSortField =
  | "created_at"
  | "display_order"
  | "duration_minutes"
  | "is_active"
  | "name"
  | "price_cents"
  | "updated_at";

export type PaginationMeta = {
  readonly page: number;
  readonly pageCount: number;
  readonly pageSize: number;
  readonly total: number;
};

export type PaginatedResult<TRow> = {
  readonly data: readonly TRow[];
  readonly pagination: PaginationMeta;
};

export type CategoryListFilters = {
  readonly active: ActiveFilter;
  readonly deleted: DeletedFilter;
  readonly direction: SortDirection;
  readonly page: number;
  readonly pageSize: number;
  readonly search: string;
  readonly sort: CategorySortField;
};

export type ServiceListFilters = {
  readonly active: ActiveFilter;
  readonly deleted: DeletedFilter;
  readonly direction: SortDirection;
  readonly page: number;
  readonly pageSize: number;
  readonly search: string;
  readonly sort: ServiceSortField;
};

export type ServiceManagementSearchParams = {
  readonly c_active?: string | readonly string[];
  readonly c_deleted?: string | readonly string[];
  readonly c_direction?: string | readonly string[];
  readonly c_page?: string | readonly string[];
  readonly c_search?: string | readonly string[];
  readonly c_sort?: string | readonly string[];
  readonly s_active?: string | readonly string[];
  readonly s_deleted?: string | readonly string[];
  readonly s_direction?: string | readonly string[];
  readonly s_page?: string | readonly string[];
  readonly s_search?: string | readonly string[];
  readonly s_sort?: string | readonly string[];
};

export type ActionState = {
  readonly errors?: Record<string, readonly string[]>;
  readonly message?: string;
  readonly success: boolean;
};

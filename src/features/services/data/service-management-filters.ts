import type {
  ActiveFilter,
  CategoryListFilters,
  CategorySortField,
  DeletedFilter,
  ServiceListFilters,
  ServiceManagementSearchParams,
  ServiceSortField,
  SortDirection,
} from "@/features/services/types/service-management.types";

const PAGE_SIZE = 10;

const categorySortFields = new Set<CategorySortField>([
  "created_at",
  "display_order",
  "is_active",
  "name",
  "updated_at",
]);

const serviceSortFields = new Set<ServiceSortField>([
  "created_at",
  "display_order",
  "duration_minutes",
  "is_active",
  "name",
  "price_cents",
  "updated_at",
]);

function readSingle(value: string | readonly string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function parsePage(value: string | readonly string[] | undefined) {
  const page = Number.parseInt(readSingle(value), 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function parseActive(value: string | readonly string[] | undefined) {
  const active = readSingle(value);

  if (active === "active" || active === "inactive") {
    return active;
  }

  return "all";
}

function parseDeleted(value: string | readonly string[] | undefined) {
  const deleted = readSingle(value);

  if (deleted === "all" || deleted === "deleted") {
    return deleted;
  }

  return "not-deleted";
}

function parseDirection(value: string | readonly string[] | undefined) {
  return readSingle(value) === "desc" ? "desc" : "asc";
}

function parseSearch(value: string | readonly string[] | undefined) {
  return readSingle(value).trim();
}

function parseCategorySort(value: string | readonly string[] | undefined) {
  const sort = readSingle(value);
  return categorySortFields.has(sort as CategorySortField)
    ? (sort as CategorySortField)
    : "display_order";
}

function parseServiceSort(value: string | readonly string[] | undefined) {
  const sort = readSingle(value);
  return serviceSortFields.has(sort as ServiceSortField)
    ? (sort as ServiceSortField)
    : "display_order";
}

export function parseCategoryListFilters(
  searchParams: ServiceManagementSearchParams,
): CategoryListFilters {
  return {
    active: parseActive(searchParams.c_active) as ActiveFilter,
    deleted: parseDeleted(searchParams.c_deleted) as DeletedFilter,
    direction: parseDirection(searchParams.c_direction) as SortDirection,
    page: parsePage(searchParams.c_page),
    pageSize: PAGE_SIZE,
    search: parseSearch(searchParams.c_search),
    sort: parseCategorySort(searchParams.c_sort),
  };
}

export function parseServiceListFilters(
  searchParams: ServiceManagementSearchParams,
): ServiceListFilters {
  return {
    active: parseActive(searchParams.s_active) as ActiveFilter,
    deleted: parseDeleted(searchParams.s_deleted) as DeletedFilter,
    direction: parseDirection(searchParams.s_direction) as SortDirection,
    page: parsePage(searchParams.s_page),
    pageSize: PAGE_SIZE,
    search: parseSearch(searchParams.s_search),
    sort: parseServiceSort(searchParams.s_sort),
  };
}

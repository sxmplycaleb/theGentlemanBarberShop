import type {
  ActiveFilter,
  CustomerListFilters,
  CustomerManagementSearchParams,
  CustomerSortField,
  DeletedFilter,
  SortDirection,
} from "@/features/customers/types/customer-management.types";

const PAGE_SIZE = 10;

const customerSortFields = new Set<CustomerSortField>([
  "created_at",
  "full_name",
  "is_active",
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
  return active === "active" || active === "inactive" ? active : "all";
}

function parseDeleted(value: string | readonly string[] | undefined) {
  const deleted = readSingle(value);
  return deleted === "all" || deleted === "deleted" ? deleted : "not-deleted";
}

function parseDirection(value: string | readonly string[] | undefined) {
  return readSingle(value) === "desc" ? "desc" : "asc";
}

function parseCustomerSort(value: string | readonly string[] | undefined) {
  const sort = readSingle(value);
  return customerSortFields.has(sort as CustomerSortField)
    ? (sort as CustomerSortField)
    : "full_name";
}

export function parseCustomerListFilters(
  searchParams: CustomerManagementSearchParams,
): CustomerListFilters {
  return {
    active: parseActive(searchParams.active) as ActiveFilter,
    deleted: parseDeleted(searchParams.deleted) as DeletedFilter,
    direction: parseDirection(searchParams.direction) as SortDirection,
    page: parsePage(searchParams.page),
    pageSize: PAGE_SIZE,
    search: readSingle(searchParams.search).trim(),
    sort: parseCustomerSort(searchParams.sort),
  };
}

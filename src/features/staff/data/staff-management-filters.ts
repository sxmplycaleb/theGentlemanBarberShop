import type {
  ActiveFilter,
  DeletedFilter,
  SortDirection,
  StaffListFilters,
  StaffManagementSearchParams,
  StaffSortField,
} from "@/features/staff/types/staff-management.types";

const PAGE_SIZE = 10;

const staffSortFields = new Set<StaffSortField>([
  "created_at",
  "display_name",
  "display_order",
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

function parseStaffSort(value: string | readonly string[] | undefined) {
  const sort = readSingle(value);
  return staffSortFields.has(sort as StaffSortField)
    ? (sort as StaffSortField)
    : "display_order";
}

export function parseStaffListFilters(
  searchParams: StaffManagementSearchParams,
): StaffListFilters {
  return {
    active: parseActive(searchParams.active) as ActiveFilter,
    deleted: parseDeleted(searchParams.deleted) as DeletedFilter,
    direction: parseDirection(searchParams.direction) as SortDirection,
    page: parsePage(searchParams.page),
    pageSize: PAGE_SIZE,
    search: parseSearch(searchParams.search),
    sort: parseStaffSort(searchParams.sort),
  };
}

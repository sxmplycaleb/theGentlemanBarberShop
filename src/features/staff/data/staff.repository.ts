import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  PaginatedResult,
  StaffListFilters,
  StaffRow,
} from "@/features/staff/types/staff-management.types";
import type { StaffFormValues } from "@/features/staff/validation/staff.schema";

function getStaffManagementClient() {
  return createSupabaseServerClient({ serviceRole: true });
}

function getPaginationRange(page: number, pageSize: number) {
  const from = (page - 1) * pageSize;
  return {
    from,
    to: from + pageSize - 1,
  };
}

function mapDatabaseError(error: { readonly message: string } | null) {
  if (!error) {
    return null;
  }

  if (error.message.includes("staff_slug_unique")) {
    return "A staff member with this slug already exists.";
  }

  return error.message;
}

export async function listStaff(
  filters: StaffListFilters,
): Promise<PaginatedResult<StaffRow>> {
  const supabase = getStaffManagementClient();
  const { from, to } = getPaginationRange(filters.page, filters.pageSize);
  let query = supabase.from("staff").select("*", { count: "exact" });

  if (filters.search) {
    const term = filters.search.replaceAll("%", "\\%");
    query = query.or(
      `display_name.ilike.%${term}%,slug.ilike.%${term}%,phone_number.ilike.%${term}%`,
    );
  }

  if (filters.active !== "all") {
    query = query.eq("is_active", filters.active === "active");
  }

  if (filters.deleted === "deleted") {
    query = query.not("deleted_at", "is", null);
  } else if (filters.deleted === "not-deleted") {
    query = query.is("deleted_at", null);
  }

  const { count, data, error } = await query
    .order(filters.sort, { ascending: filters.direction === "asc" })
    .order("display_name", { ascending: true })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;

  return {
    data: data ?? [],
    pagination: {
      page: filters.page,
      pageCount: Math.max(1, Math.ceil(total / filters.pageSize)),
      pageSize: filters.pageSize,
      total,
    },
  };
}

export async function getStaffById(id: string) {
  const supabase = getStaffManagementClient();
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createStaff(values: StaffFormValues) {
  const supabase = getStaffManagementClient();
  const { error } = await supabase.from("staff").insert(values);
  const message = mapDatabaseError(error);

  if (message) {
    throw new Error(message);
  }
}

export async function updateStaff(id: string, values: StaffFormValues) {
  const supabase = getStaffManagementClient();
  const { error } = await supabase.from("staff").update(values).eq("id", id);
  const message = mapDatabaseError(error);

  if (message) {
    throw new Error(message);
  }
}

export async function setStaffActive(id: string, isActive: boolean) {
  const supabase = getStaffManagementClient();
  const { error } = await supabase
    .from("staff")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function softDeleteStaff(id: string) {
  const supabase = getStaffManagementClient();
  const { error } = await supabase
    .from("staff")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    throw new Error(error.message);
  }
}

export async function restoreStaff(id: string) {
  const supabase = getStaffManagementClient();
  const { error } = await supabase
    .from("staff")
    .update({ deleted_at: null })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

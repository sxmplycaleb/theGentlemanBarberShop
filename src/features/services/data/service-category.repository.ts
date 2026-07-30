import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CategoryListFilters,
  PaginatedResult,
  ServiceCategoryRow,
} from "@/features/services/types/service-management.types";
import type { ServiceCategoryFormValues } from "@/features/services/validation/service-category.schema";

function getServiceManagementClient() {
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

  if (error.message.includes("service_categories_slug_unique")) {
    return "A category with this slug already exists.";
  }

  return error.message;
}

export async function listServiceCategories(
  filters: CategoryListFilters,
): Promise<PaginatedResult<ServiceCategoryRow>> {
  const supabase = getServiceManagementClient();
  const { from, to } = getPaginationRange(filters.page, filters.pageSize);
  let query = supabase
    .from("service_categories")
    .select("*", { count: "exact" });

  if (filters.search) {
    const term = filters.search.replaceAll("%", "\\%");
    query = query.or(`name.ilike.%${term}%,slug.ilike.%${term}%`);
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
    .order("name", { ascending: true })
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

export async function listAvailableServiceCategories() {
  const supabase = getServiceManagementClient();
  const { data, error } = await supabase
    .from("service_categories")
    .select("*")
    .is("deleted_at", null)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getServiceCategoryById(id: string) {
  const supabase = getServiceManagementClient();
  const { data, error } = await supabase
    .from("service_categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createServiceCategory(values: ServiceCategoryFormValues) {
  const supabase = getServiceManagementClient();
  const { error } = await supabase.from("service_categories").insert(values);
  const message = mapDatabaseError(error);

  if (message) {
    throw new Error(message);
  }
}

export async function updateServiceCategory(
  id: string,
  values: ServiceCategoryFormValues,
) {
  const supabase = getServiceManagementClient();
  const { error } = await supabase
    .from("service_categories")
    .update(values)
    .eq("id", id);
  const message = mapDatabaseError(error);

  if (message) {
    throw new Error(message);
  }
}

export async function setServiceCategoryActive(id: string, isActive: boolean) {
  const supabase = getServiceManagementClient();
  const { error } = await supabase
    .from("service_categories")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function softDeleteServiceCategory(id: string) {
  const supabase = getServiceManagementClient();
  const { count, error: countError } = await supabase
    .from("services")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id)
    .is("deleted_at", null);

  if (countError) {
    throw new Error(countError.message);
  }

  if ((count ?? 0) > 0) {
    throw new Error(
      "Delete or restore linked services first. Categories cannot be deleted while active records reference them.",
    );
  }

  const { error } = await supabase
    .from("service_categories")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    throw new Error(error.message);
  }
}

export async function restoreServiceCategory(id: string) {
  const supabase = getServiceManagementClient();
  const { error } = await supabase
    .from("service_categories")
    .update({ deleted_at: null })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

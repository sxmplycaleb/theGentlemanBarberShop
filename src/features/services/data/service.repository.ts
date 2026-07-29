import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  PaginatedResult,
  ServiceListFilters,
  ServiceRow,
  ServiceWithCategory,
} from "@/features/services/types/service-management.types";
import type { ServiceFormValues } from "@/features/services/validation/service.schema";

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

  if (error.message.includes("services_slug_unique")) {
    return "A service with this slug already exists.";
  }

  if (error.message.includes("services_category_id_fkey")) {
    return "Choose an existing category.";
  }

  return error.message;
}

function mapServiceWithCategory(
  row: ServiceRow & {
    readonly service_categories: {
      readonly deleted_at: string | null;
      readonly id: string;
      readonly name: string;
      readonly slug: string;
    } | null;
  },
): ServiceWithCategory {
  const { service_categories: category, ...service } = row;

  return {
    ...service,
    category,
  };
}

export async function listServices(
  filters: ServiceListFilters,
): Promise<PaginatedResult<ServiceWithCategory>> {
  const supabase = getServiceManagementClient();
  const { from, to } = getPaginationRange(filters.page, filters.pageSize);
  let query = supabase
    .from("services")
    .select("*, service_categories(id, name, slug, deleted_at)", {
      count: "exact",
    });

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
    data: (data ?? []).map((row) =>
      mapServiceWithCategory(
        row as ServiceRow & {
          readonly service_categories: {
            readonly deleted_at: string | null;
            readonly id: string;
            readonly name: string;
            readonly slug: string;
          } | null;
        },
      ),
    ),
    pagination: {
      page: filters.page,
      pageCount: Math.max(1, Math.ceil(total / filters.pageSize)),
      pageSize: filters.pageSize,
      total,
    },
  };
}

export async function getServiceById(id: string) {
  const supabase = getServiceManagementClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createService(values: ServiceFormValues) {
  const supabase = getServiceManagementClient();
  const { error } = await supabase.from("services").insert(values);
  const message = mapDatabaseError(error);

  if (message) {
    throw new Error(message);
  }
}

export async function updateService(id: string, values: ServiceFormValues) {
  const supabase = getServiceManagementClient();
  const { error } = await supabase.from("services").update(values).eq("id", id);
  const message = mapDatabaseError(error);

  if (message) {
    throw new Error(message);
  }
}

export async function setServiceActive(id: string, isActive: boolean) {
  const supabase = getServiceManagementClient();
  const { error } = await supabase
    .from("services")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function softDeleteService(id: string) {
  const supabase = getServiceManagementClient();
  const { error } = await supabase
    .from("services")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    throw new Error(error.message);
  }
}

export async function restoreService(id: string) {
  const supabase = getServiceManagementClient();
  const { error } = await supabase
    .from("services")
    .update({ deleted_at: null })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

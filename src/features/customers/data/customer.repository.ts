import "server-only";

import type {
  CustomerListFilters,
  CustomerRow,
  PaginatedResult,
} from "@/features/customers/types/customer-management.types";
import type { CustomerFormValues } from "@/features/customers/validation/customer.schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const customerColumns =
  "created_at,deleted_at,email,full_name,id,is_active,notes,phone_number,updated_at";

function getCustomerManagementClient() {
  return createSupabaseServerClient({ serviceRole: true });
}

function getPaginationRange(page: number, pageSize: number) {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

function escapePostgrestSearchTerm(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_");
}

function mutationError(message: string): never {
  throw new Error(message);
}

export async function listCustomers(
  filters: CustomerListFilters,
): Promise<PaginatedResult<CustomerRow>> {
  const supabase = getCustomerManagementClient();
  const { from, to } = getPaginationRange(filters.page, filters.pageSize);
  let query = supabase
    .from("customers")
    .select(customerColumns, { count: "exact" });

  if (filters.search) {
    const term = escapePostgrestSearchTerm(filters.search);
    const pattern = `"%${term}%"`;
    query = query.or(
      `full_name.ilike.${pattern},phone_number.ilike.${pattern},email.ilike.${pattern}`,
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
    .order("full_name", { ascending: true })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    throw new Error("Customers could not be loaded.");
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

export async function getCustomerById(id: string) {
  const supabase = getCustomerManagementClient();
  const { data, error } = await supabase
    .from("customers")
    .select(customerColumns)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Customer could not be loaded.");
  }

  return data;
}

export async function createCustomer(values: CustomerFormValues) {
  const supabase = getCustomerManagementClient();
  const { data, error } = await supabase
    .from("customers")
    .insert(values)
    .select("id")
    .single();

  if (error || !data) {
    mutationError("Customer could not be created.");
  }
}

export async function updateCustomer(id: string, values: CustomerFormValues) {
  const supabase = getCustomerManagementClient();
  const { data, error } = await supabase
    .from("customers")
    .update(values)
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    mutationError("Customer could not be updated.");
  }
}

export async function setCustomerActive(id: string, isActive: boolean) {
  const supabase = getCustomerManagementClient();
  const { data, error } = await supabase
    .from("customers")
    .update({ is_active: isActive })
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    mutationError("Customer status could not be updated.");
  }
}

export async function softDeleteCustomer(id: string) {
  const supabase = getCustomerManagementClient();
  const { data, error } = await supabase
    .from("customers")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    mutationError("Customer could not be deleted.");
  }
}

export async function restoreCustomer(id: string) {
  const supabase = getCustomerManagementClient();
  const { data, error } = await supabase
    .from("customers")
    .update({ deleted_at: null })
    .eq("id", id)
    .not("deleted_at", "is", null)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    mutationError("Customer could not be restored.");
  }
}

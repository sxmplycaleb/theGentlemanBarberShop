import { beforeEach, describe, expect, it, vi } from "vitest";

const { createSupabaseServerClient } = vi.hoisted(() => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient }));

import {
  createCustomer,
  getCustomerById,
  listCustomers,
  restoreCustomer,
  setCustomerActive,
  softDeleteCustomer,
  updateCustomer,
} from "@/features/customers/data/customer.repository";
import type { CustomerListFilters } from "@/features/customers/types/customer-management.types";

const customer = {
  created_at: "2026-07-30T00:00:00.000Z",
  deleted_at: null,
  email: "alex@example.com",
  full_name: "Alex Mwangi",
  id: "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2",
  is_active: true,
  notes: "Regular customer",
  phone_number: "+254700000000",
  updated_at: "2026-07-30T00:00:00.000Z",
} as const;

const values = {
  email: customer.email,
  full_name: customer.full_name,
  is_active: customer.is_active,
  notes: customer.notes,
  phone_number: customer.phone_number,
};

const baseFilters: CustomerListFilters = {
  active: "all",
  deleted: "not-deleted",
  direction: "asc",
  page: 2,
  pageSize: 10,
  search: "",
  sort: "full_name",
};

type ListResult = {
  readonly count: number | null;
  readonly data: readonly (typeof customer)[] | null;
  readonly error: { readonly message: string } | null;
};

function listChain(
  result: ListResult = {
    count: 11,
    data: [customer],
    error: null,
  },
) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  for (const method of ["eq", "is", "not", "or", "order"]) {
    chain[method] = vi.fn(() => chain);
  }
  chain.range = vi.fn().mockResolvedValue(result);
  const select = vi.fn(() => chain);
  const from = vi.fn(() => ({ select }));
  createSupabaseServerClient.mockReturnValue({ from });
  return { chain, from, select };
}

function readChain(result: {
  readonly data: typeof customer | null;
  readonly error: { readonly message: string } | null;
}) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));
  createSupabaseServerClient.mockReturnValue({ from });
  return { eq, from, maybeSingle, select };
}

function mutationChain(
  terminal: "maybeSingle" | "single",
  result: {
    readonly data: { readonly id: string } | null;
    readonly error: { readonly message: string } | null;
  } = { data: { id: customer.id }, error: null },
) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  for (const method of ["eq", "is", "not", "select"]) {
    chain[method] = vi.fn(() => chain);
  }
  chain[terminal] = vi.fn().mockResolvedValue(result);
  const insert = vi.fn(() => chain);
  const update = vi.fn(() => chain);
  const from = vi.fn(() => ({ insert, update }));
  createSupabaseServerClient.mockReturnValue({ from });
  return { chain, from, insert, update };
}

describe("customer repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists current customers with exact pagination and stable ordering", async () => {
    const query = listChain();

    await expect(listCustomers(baseFilters)).resolves.toEqual({
      data: [customer],
      pagination: { page: 2, pageCount: 2, pageSize: 10, total: 11 },
    });
    expect(createSupabaseServerClient).toHaveBeenCalledWith({
      serviceRole: true,
    });
    expect(query.from).toHaveBeenCalledWith("customers");
    expect(query.chain.is).toHaveBeenCalledWith("deleted_at", null);
    expect(query.chain.range).toHaveBeenCalledWith(10, 19);
    expect(query.chain.order).toHaveBeenCalledWith("id", { ascending: true });
  });

  it("searches with escaped ILIKE input and active/deleted filters", async () => {
    const query = listChain({ count: null, data: [], error: null });

    await expect(
      listCustomers({
        ...baseFilters,
        active: "inactive",
        deleted: "deleted",
        direction: "desc",
        page: 1,
        search: "A%,_(B)",
        sort: "updated_at",
      }),
    ).resolves.toMatchObject({
      pagination: { pageCount: 1, total: 0 },
    });

    expect(query.chain.or).toHaveBeenCalledWith(
      'full_name.ilike."%A\\%,\\_(B)%",phone_number.ilike."%A\\%,\\_(B)%",email.ilike."%A\\%,\\_(B)%"',
    );
    expect(query.chain.eq).toHaveBeenCalledWith("is_active", false);
    expect(query.chain.not).toHaveBeenCalledWith("deleted_at", "is", null);
    expect(query.chain.order).toHaveBeenCalledWith("updated_at", {
      ascending: false,
    });
  });

  it("supports all records and replaces list database errors", async () => {
    const query = listChain({
      count: 0,
      data: null,
      error: { message: "sensitive detail" },
    });

    await expect(
      listCustomers({ ...baseFilters, deleted: "all" }),
    ).rejects.toThrow("Customers could not be loaded.");
    expect(query.chain.is).not.toHaveBeenCalled();
    expect(query.chain.not).not.toHaveBeenCalled();
  });

  it("loads one customer or null with a safe error", async () => {
    const read = readChain({ data: customer, error: null });
    await expect(getCustomerById(customer.id)).resolves.toEqual(customer);
    expect(read.eq).toHaveBeenCalledWith("id", customer.id);

    readChain({ data: null, error: null });
    await expect(getCustomerById(customer.id)).resolves.toBeNull();

    readChain({ data: null, error: { message: "detail" } });
    await expect(getCustomerById(customer.id)).rejects.toThrow(
      "Customer could not be loaded.",
    );
  });

  it("creates and updates only validated customer values", async () => {
    const create = mutationChain("single");
    await expect(createCustomer(values)).resolves.toBeUndefined();
    expect(create.insert).toHaveBeenCalledWith(values);

    const update = mutationChain("maybeSingle");
    await expect(updateCustomer(customer.id, values)).resolves.toBeUndefined();
    expect(update.update).toHaveBeenCalledWith(values);
    expect(update.chain.is).toHaveBeenCalledWith("deleted_at", null);
  });

  it("changes status, soft deletes, and restores with state guards", async () => {
    const status = mutationChain("maybeSingle");
    await setCustomerActive(customer.id, false);
    expect(status.update).toHaveBeenCalledWith({ is_active: false });

    const deletion = mutationChain("maybeSingle");
    await softDeleteCustomer(customer.id);
    expect(deletion.update).toHaveBeenCalledWith({
      deleted_at: expect.any(String),
    });
    expect(deletion.chain.is).toHaveBeenCalledWith("deleted_at", null);

    const restore = mutationChain("maybeSingle");
    await restoreCustomer(customer.id);
    expect(restore.update).toHaveBeenCalledWith({ deleted_at: null });
    expect(restore.chain.not).toHaveBeenCalledWith("deleted_at", "is", null);
  });

  it.each([
    ["create", () => createCustomer(values), "single"],
    ["update", () => updateCustomer(customer.id, values), "maybeSingle"],
    ["status", () => setCustomerActive(customer.id, false), "maybeSingle"],
    ["delete", () => softDeleteCustomer(customer.id), "maybeSingle"],
    ["restore", () => restoreCustomer(customer.id), "maybeSingle"],
  ] as const)(
    "rejects unsuccessful %s mutations",
    async (_name, call, terminal) => {
      mutationChain(terminal, {
        data: null,
        error: { message: "sensitive detail" },
      });
      await expect(call()).rejects.toThrow(/Customer/);
    },
  );
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({ protect: vi.fn() }));
const { revalidatePath } = vi.hoisted(() => ({ revalidatePath: vi.fn() }));
const repositories = vi.hoisted(() => ({
  createCustomer: vi.fn(),
  restoreCustomer: vi.fn(),
  setCustomerActive: vi.fn(),
  softDeleteCustomer: vi.fn(),
  updateCustomer: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: { protect } }));
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/features/customers/data/customer.repository", () => repositories);

import {
  createCustomerAction,
  restoreCustomerAction,
  setCustomerActiveAction,
  softDeleteCustomerAction,
  updateCustomerAction,
} from "@/features/customers/actions/customer.actions";
import type { ActionState } from "@/features/customers/types/customer-management.types";

const initialState: ActionState = { success: false };
const customerId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";

function customerFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const values = {
    email: "ALEX@EXAMPLE.COM",
    full_name: "Alex Mwangi",
    is_active: "on",
    notes: "Regular customer",
    phone_number: "+254700000000",
    ...overrides,
  };
  Object.entries(values).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

function idFormData(extra: Record<string, string> = {}) {
  const formData = new FormData();
  formData.set("id", customerId);
  Object.entries(extra).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

describe("customer actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    protect.mockResolvedValue({ userId: "user_123" });
  });

  it("protects, validates, creates, and revalidates", async () => {
    const result = await createCustomerAction(initialState, customerFormData());

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.createCustomer).toHaveBeenCalledWith({
      email: "alex@example.com",
      full_name: "Alex Mwangi",
      is_active: true,
      notes: "Regular customer",
      phone_number: "+254700000000",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/account/customers");
    expect(result).toEqual({ message: "Customer created.", success: true });
  });

  it("rejects invalid and unknown create input without writing", async () => {
    const formData = customerFormData({ full_name: "" });
    formData.set("role", "admin");

    const result = await createCustomerAction(initialState, formData);

    expect(repositories.createCustomer).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it("returns a safe create failure", async () => {
    repositories.createCustomer.mockRejectedValueOnce(
      new Error("database detail"),
    );
    await expect(
      createCustomerAction(initialState, customerFormData()),
    ).resolves.toEqual({
      message: "Customer could not be created. Please try again.",
      success: false,
    });
  });

  it("updates a valid customer", async () => {
    const result = await updateCustomerAction(
      customerId,
      initialState,
      customerFormData(),
    );

    expect(repositories.updateCustomer).toHaveBeenCalledWith(
      customerId,
      expect.objectContaining({ full_name: "Alex Mwangi" }),
    );
    expect(result).toEqual({ message: "Customer updated.", success: true });
  });

  it("rejects invalid update identifiers and values", async () => {
    expect(
      await updateCustomerAction("invalid", initialState, customerFormData()),
    ).toEqual({ message: "Invalid customer.", success: false });
    expect(
      (
        await updateCustomerAction(
          customerId,
          initialState,
          customerFormData({ email: "invalid" }),
        )
      ).errors?.email,
    ).toBeDefined();
  });

  it("soft deletes and restores valid customers", async () => {
    expect(await softDeleteCustomerAction(initialState, idFormData())).toEqual({
      message: "Customer deleted.",
      success: true,
    });
    expect(await restoreCustomerAction(initialState, idFormData())).toEqual({
      message: "Customer restored.",
      success: true,
    });
    expect(repositories.softDeleteCustomer).toHaveBeenCalledWith(customerId);
    expect(repositories.restoreCustomer).toHaveBeenCalledWith(customerId);
  });

  it("rejects invalid delete and restore input", async () => {
    const invalid = new FormData();
    invalid.set("id", "invalid");

    expect(await softDeleteCustomerAction(initialState, invalid)).toEqual({
      message: "Invalid customer.",
      success: false,
    });
    expect(await restoreCustomerAction(initialState, invalid)).toEqual({
      message: "Invalid customer.",
      success: false,
    });
  });

  it("changes status and rejects unknown action input", async () => {
    expect(
      await setCustomerActiveAction(
        initialState,
        idFormData({ is_active: "false" }),
      ),
    ).toEqual({ message: "Customer deactivated.", success: true });
    expect(
      await setCustomerActiveAction(
        initialState,
        idFormData({ is_active: "true" }),
      ),
    ).toEqual({ message: "Customer activated.", success: true });

    const invalid = idFormData({ extra: "value", is_active: "true" });
    expect(await setCustomerActiveAction(initialState, invalid)).toEqual({
      message: "Invalid customer status.",
      success: false,
    });
  });

  it("returns safe mutation failures", async () => {
    repositories.updateCustomer.mockRejectedValueOnce(new Error("detail"));
    repositories.softDeleteCustomer.mockRejectedValueOnce(new Error("detail"));
    repositories.restoreCustomer.mockRejectedValueOnce(new Error("detail"));
    repositories.setCustomerActive.mockRejectedValueOnce(new Error("detail"));

    expect(
      await updateCustomerAction(customerId, initialState, customerFormData()),
    ).toMatchObject({ success: false });
    expect(
      await softDeleteCustomerAction(initialState, idFormData()),
    ).toMatchObject({ success: false });
    expect(
      await restoreCustomerAction(initialState, idFormData()),
    ).toMatchObject({ success: false });
    expect(
      await setCustomerActiveAction(
        initialState,
        idFormData({ is_active: "true" }),
      ),
    ).toEqual({
      message: "Customer status could not be updated. Please try again.",
      success: false,
    });
  });
});

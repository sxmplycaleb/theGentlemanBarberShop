import { beforeEach, describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({
  protect: vi.fn(),
}));

const { revalidatePath } = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
}));

const repositories = vi.hoisted(() => ({
  createStaff: vi.fn(),
  restoreStaff: vi.fn(),
  setStaffActive: vi.fn(),
  softDeleteStaff: vi.fn(),
  updateStaff: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect,
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath,
}));

vi.mock("@/features/staff/data/staff.repository", () => repositories);

import {
  createStaffAction,
  restoreStaffAction,
  setStaffActiveAction,
  softDeleteStaffAction,
  updateStaffAction,
} from "@/features/staff/actions/staff.actions";
import type { ActionState } from "@/features/staff/types/staff-management.types";

const initialState: ActionState = {
  success: false,
};

const staffId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";

function buildStaffFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const values = {
    bio: "Senior barber",
    display_name: "Alex Mwangi",
    display_order: "2",
    is_active: "on",
    phone_number: "+254700000000",
    slug: "alex-mwangi",
    ...overrides,
  };

  Object.entries(values).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
}

describe("staff actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    protect.mockResolvedValue({ userId: "user_123" });
  });

  it("authenticates, validates, creates staff, and revalidates", async () => {
    const result = await createStaffAction(initialState, buildStaffFormData());

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.createStaff).toHaveBeenCalledWith({
      bio: "Senior barber",
      display_name: "Alex Mwangi",
      display_order: 2,
      is_active: true,
      phone_number: "+254700000000",
      slug: "alex-mwangi",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/account/staff");
    expect(result).toEqual({
      message: "Staff member created.",
      success: true,
    });
  });

  it("returns validation errors without writing", async () => {
    const result = await createStaffAction(
      initialState,
      buildStaffFormData({ display_name: "", slug: "Bad Slug" }),
    );

    expect(repositories.createStaff).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.errors?.display_name).toBeDefined();
    expect(result.errors?.slug).toBeDefined();
  });

  it("returns unique slug errors from the repository", async () => {
    repositories.createStaff.mockRejectedValueOnce(
      new Error("A staff member with this slug already exists."),
    );

    const result = await createStaffAction(initialState, buildStaffFormData());

    expect(result).toEqual({
      message: "A staff member with this slug already exists.",
      success: false,
    });
  });

  it("authenticates, validates, updates staff, and revalidates", async () => {
    const result = await updateStaffAction(
      staffId,
      initialState,
      buildStaffFormData({ display_order: "4" }),
    );

    expect(repositories.updateStaff).toHaveBeenCalledWith(
      staffId,
      expect.objectContaining({ display_order: 4 }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/account/staff");
    expect(result.success).toBe(true);
  });

  it("soft deletes staff with structured state", async () => {
    const formData = new FormData();
    formData.set("id", staffId);

    const result = await softDeleteStaffAction(initialState, formData);

    expect(repositories.softDeleteStaff).toHaveBeenCalledWith(staffId);
    expect(result).toEqual({
      message: "Staff member deleted.",
      success: true,
    });
  });

  it("restores staff with structured state", async () => {
    const formData = new FormData();
    formData.set("id", staffId);

    const result = await restoreStaffAction(initialState, formData);

    expect(repositories.restoreStaff).toHaveBeenCalledWith(staffId);
    expect(result).toEqual({
      message: "Staff member restored.",
      success: true,
    });
  });

  it("sets staff active state with structured state", async () => {
    const formData = new FormData();
    formData.set("id", staffId);
    formData.set("is_active", "false");

    const result = await setStaffActiveAction(initialState, formData);

    expect(repositories.setStaffActive).toHaveBeenCalledWith(staffId, false);
    expect(result).toEqual({
      message: "Staff member deactivated.",
      success: true,
    });
  });
});

import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({
  protect: vi.fn(),
}));

const repositories = vi.hoisted(() => ({
  getStaffById: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect,
  },
}));

vi.mock("@/features/staff/actions/staff.actions", () => ({
  updateStaffAction: vi.fn(),
}));

vi.mock("@/features/staff/data/staff.repository", () => ({
  getStaffById: repositories.getStaffById,
}));

vi.mock("@/features/staff/presentation/staff-form", () => ({
  StaffForm: (props: {
    readonly staff: { readonly id: string };
    readonly submitLabel: string;
  }) => <form data-staff-id={props.staff.id}>{props.submitLabel}</form>,
}));

vi.mock("@/features/staff/presentation/staff-form-page", () => ({
  StaffFormPage: (props: {
    readonly children: React.ReactNode;
    readonly title: string;
  }) => <main data-title={props.title}>{props.children}</main>,
}));

import Page from "@/app/account/staff/[staffId]/edit/page";

const staffId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";

describe("edit staff page", () => {
  it("protects and loads the staff member", async () => {
    const staff = { id: staffId, display_name: "Alex" };

    protect.mockResolvedValueOnce({ userId: "user_123" });
    repositories.getStaffById.mockResolvedValueOnce(staff);

    const element = await Page({
      params: Promise.resolve({ staffId }),
    });

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.getStaffById).toHaveBeenCalledWith(staffId);
    expect(element.props.title).toBe("Edit staff member");
    expect(element.props.children.props.staff).toBe(staff);
  });
});

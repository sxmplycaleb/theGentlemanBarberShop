import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({
  protect: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect,
  },
}));

vi.mock("@/features/staff/actions/staff.actions", () => ({
  createStaffAction: vi.fn(),
}));

vi.mock("@/features/staff/presentation/staff-form", () => ({
  StaffForm: (props: { readonly submitLabel: string }) => (
    <form data-testid="staff-form">{props.submitLabel}</form>
  ),
}));

vi.mock("@/features/staff/presentation/staff-form-page", () => ({
  StaffFormPage: (props: {
    readonly children: React.ReactNode;
    readonly title: string;
  }) => <main data-title={props.title}>{props.children}</main>,
}));

import Page from "@/app/account/staff/new/page";

describe("new staff page", () => {
  it("protects before rendering the create form", async () => {
    protect.mockResolvedValueOnce({ userId: "user_123" });

    const element = await Page();

    expect(protect).toHaveBeenCalledOnce();
    expect(element.props.title).toBe("New staff member");
    expect(element.props.children.props.submitLabel).toBe(
      "Create staff member",
    );
  });
});

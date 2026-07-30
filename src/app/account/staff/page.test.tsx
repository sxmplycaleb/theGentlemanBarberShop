import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({
  protect: vi.fn(),
}));

const repositories = vi.hoisted(() => ({
  listStaff: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect,
  },
}));

vi.mock("@/features/staff/data/staff.repository", () => ({
  listStaff: repositories.listStaff,
}));

vi.mock("@/features/staff/presentation/staff-management-page", () => ({
  StaffManagementPage: (props: { readonly result: unknown }) => (
    <main data-testid="staff-management-page" {...props} />
  ),
}));

import Page from "@/app/account/staff/page";

describe("staff management page", () => {
  it("protects and loads staff data", async () => {
    const result = {
      data: [],
      pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
    };

    protect.mockResolvedValueOnce({ userId: "user_123" });
    repositories.listStaff.mockResolvedValueOnce(result);

    const element = await Page({
      searchParams: Promise.resolve({
        search: "alex",
      }),
    });

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.listStaff).toHaveBeenCalledWith(
      expect.objectContaining({ search: "alex" }),
    );
    expect(element.props.result).toBe(result);
  });
});

import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({ protect: vi.fn() }));
const repositories = vi.hoisted(() => ({ listCustomers: vi.fn() }));

vi.mock("@clerk/nextjs/server", () => ({ auth: { protect } }));
vi.mock("@/features/customers/data/customer.repository", () => repositories);
vi.mock("@/features/customers/presentation/customer-management-page", () => ({
  CustomerManagementPage: (props: { readonly result: unknown }) => (
    <main data-testid="customer-management-page" {...props} />
  ),
}));

import Page from "@/app/account/customers/page";

describe("customer management page", () => {
  it("protects and loads filtered customer data", async () => {
    const result = {
      data: [],
      pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
    };
    protect.mockResolvedValueOnce({ userId: "user_123" });
    repositories.listCustomers.mockResolvedValueOnce(result);

    const element = await Page({
      searchParams: Promise.resolve({ search: "alex" }),
    });

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.listCustomers).toHaveBeenCalledWith(
      expect.objectContaining({ search: "alex" }),
    );
    expect(element.props.result).toBe(result);
  });
});

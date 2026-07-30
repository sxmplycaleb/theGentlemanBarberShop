import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({
  protect: vi.fn(),
}));

const repositories = vi.hoisted(() => ({
  listServiceCategories: vi.fn(),
  listServices: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect,
  },
}));

vi.mock("@/features/services/data/service-category.repository", () => ({
  listServiceCategories: repositories.listServiceCategories,
}));

vi.mock("@/features/services/data/service.repository", () => ({
  listServices: repositories.listServices,
}));

vi.mock("@/features/services/presentation/service-management-page", () => ({
  ServiceManagementPage: (props: {
    readonly categoryResult: unknown;
    readonly serviceResult: unknown;
  }) => <main data-testid="service-management-page" {...props} />,
}));

import Page from "@/app/account/services/page";

describe("service management page", () => {
  it("protects and loads category and service data", async () => {
    const categoryResult = {
      data: [],
      pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
    };
    const serviceResult = {
      data: [],
      pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
    };

    protect.mockResolvedValueOnce({ userId: "user_123" });
    repositories.listServiceCategories.mockResolvedValueOnce(categoryResult);
    repositories.listServices.mockResolvedValueOnce(serviceResult);

    const element = await Page({
      searchParams: Promise.resolve({
        c_search: "hair",
        s_search: "beard",
      }),
    });

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.listServiceCategories).toHaveBeenCalledWith(
      expect.objectContaining({ search: "hair" }),
    );
    expect(repositories.listServices).toHaveBeenCalledWith(
      expect.objectContaining({ search: "beard" }),
    );
    expect(element.props.categoryResult).toBe(categoryResult);
    expect(element.props.serviceResult).toBe(serviceResult);
  });
});

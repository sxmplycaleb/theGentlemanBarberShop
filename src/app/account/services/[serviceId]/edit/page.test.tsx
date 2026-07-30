import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({
  protect: vi.fn(),
}));

const repositories = vi.hoisted(() => ({
  getServiceById: vi.fn(),
  listAvailableServiceCategories: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect,
  },
}));

vi.mock("@/features/services/actions/service.actions", () => ({
  updateServiceAction: vi.fn(),
}));

vi.mock("@/features/services/data/service-category.repository", () => ({
  listAvailableServiceCategories: repositories.listAvailableServiceCategories,
}));

vi.mock("@/features/services/data/service.repository", () => ({
  getServiceById: repositories.getServiceById,
}));

vi.mock("@/features/services/presentation/service-form", () => ({
  ServiceForm: (props: {
    readonly categories: readonly unknown[];
    readonly service: { readonly id: string };
    readonly submitLabel: string;
  }) => <form data-service-id={props.service.id}>{props.submitLabel}</form>,
}));

vi.mock("@/features/services/presentation/service-form-page", () => ({
  ServiceFormPage: (props: {
    readonly children: React.ReactNode;
    readonly title: string;
  }) => <main data-title={props.title}>{props.children}</main>,
}));

import Page from "@/app/account/services/[serviceId]/edit/page";

const serviceId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";

describe("edit service page", () => {
  it("protects and loads the service with categories", async () => {
    const categories = [{ id: "category_1", name: "Hair" }];
    const service = { id: serviceId, name: "Cut" };

    protect.mockResolvedValueOnce({ userId: "user_123" });
    repositories.listAvailableServiceCategories.mockResolvedValueOnce(
      categories,
    );
    repositories.getServiceById.mockResolvedValueOnce(service);

    const element = await Page({
      params: Promise.resolve({ serviceId }),
    });

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.getServiceById).toHaveBeenCalledWith(serviceId);
    expect(element.props.title).toBe("Edit service");
    expect(element.props.children.props.categories).toBe(categories);
    expect(element.props.children.props.service).toBe(service);
  });
});

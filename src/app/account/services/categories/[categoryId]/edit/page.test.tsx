import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({
  protect: vi.fn(),
}));

const repositories = vi.hoisted(() => ({
  getServiceCategoryById: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect,
  },
}));

vi.mock("@/features/services/actions/service-category.actions", () => ({
  updateServiceCategoryAction: vi.fn(),
}));

vi.mock("@/features/services/data/service-category.repository", () => ({
  getServiceCategoryById: repositories.getServiceCategoryById,
}));

vi.mock("@/features/services/presentation/service-category-form", () => ({
  ServiceCategoryForm: (props: {
    readonly category: { readonly id: string };
    readonly submitLabel: string;
  }) => <form data-category-id={props.category.id}>{props.submitLabel}</form>,
}));

vi.mock("@/features/services/presentation/service-form-page", () => ({
  ServiceFormPage: (props: {
    readonly children: React.ReactNode;
    readonly title: string;
  }) => <main data-title={props.title}>{props.children}</main>,
}));

import Page from "@/app/account/services/categories/[categoryId]/edit/page";

const categoryId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";

describe("edit service category page", () => {
  it("protects and loads the category", async () => {
    const category = { id: categoryId, name: "Hair" };

    protect.mockResolvedValueOnce({ userId: "user_123" });
    repositories.getServiceCategoryById.mockResolvedValueOnce(category);

    const element = await Page({
      params: Promise.resolve({ categoryId }),
    });

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.getServiceCategoryById).toHaveBeenCalledWith(
      categoryId,
    );
    expect(element.props.title).toBe("Edit category");
    expect(element.props.children.props.category).toBe(category);
  });
});

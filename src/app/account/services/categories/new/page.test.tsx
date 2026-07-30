import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({
  protect: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect,
  },
}));

vi.mock("@/features/services/actions/service-category.actions", () => ({
  createServiceCategoryAction: vi.fn(),
}));

vi.mock("@/features/services/presentation/service-category-form", () => ({
  ServiceCategoryForm: (props: { readonly submitLabel: string }) => (
    <form data-testid="category-form">{props.submitLabel}</form>
  ),
}));

vi.mock("@/features/services/presentation/service-form-page", () => ({
  ServiceFormPage: (props: {
    readonly children: React.ReactNode;
    readonly title: string;
  }) => <main data-title={props.title}>{props.children}</main>,
}));

import Page from "@/app/account/services/categories/new/page";

describe("new service category page", () => {
  it("protects before rendering the create form", async () => {
    protect.mockResolvedValueOnce({ userId: "user_123" });

    const element = await Page();

    expect(protect).toHaveBeenCalledOnce();
    expect(element.props.title).toBe("New category");
    expect(element.props.children.props.submitLabel).toBe("Create category");
  });
});

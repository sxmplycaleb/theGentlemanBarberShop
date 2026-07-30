import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({
  protect: vi.fn(),
}));

const repositories = vi.hoisted(() => ({
  listAvailableServiceCategories: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect,
  },
}));

vi.mock("@/features/services/actions/service.actions", () => ({
  createServiceAction: vi.fn(),
}));

vi.mock("@/features/services/data/service-category.repository", () => ({
  listAvailableServiceCategories: repositories.listAvailableServiceCategories,
}));

vi.mock("@/features/services/presentation/service-form", () => ({
  ServiceForm: (props: { readonly submitLabel: string }) => (
    <form data-testid="service-form">{props.submitLabel}</form>
  ),
}));

vi.mock("@/features/services/presentation/service-form-page", () => ({
  ServiceFormPage: (props: {
    readonly children: React.ReactNode;
    readonly title: string;
  }) => <main data-title={props.title}>{props.children}</main>,
}));

import Page from "@/app/account/services/new/page";

describe("new service page", () => {
  it("protects and loads categories before rendering the create form", async () => {
    const categories = [{ id: "category_1", name: "Hair" }];

    protect.mockResolvedValueOnce({ userId: "user_123" });
    repositories.listAvailableServiceCategories.mockResolvedValueOnce(
      categories,
    );

    const element = await Page();

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.listAvailableServiceCategories).toHaveBeenCalledOnce();
    expect(element.props.title).toBe("New service");
    expect(element.props.children.props.categories).toBe(categories);
  });
});

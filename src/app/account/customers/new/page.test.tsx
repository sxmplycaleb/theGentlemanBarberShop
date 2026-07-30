import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({ protect: vi.fn() }));

vi.mock("@clerk/nextjs/server", () => ({ auth: { protect } }));
vi.mock("@/features/customers/actions/customer.actions", () => ({
  createCustomerAction: vi.fn(),
}));
vi.mock("@/features/customers/presentation/customer-form", () => ({
  CustomerForm: (props: { readonly submitLabel: string }) => (
    <form data-testid="customer-form">{props.submitLabel}</form>
  ),
}));
vi.mock("@/features/customers/presentation/customer-form-page", () => ({
  CustomerFormPage: (props: {
    readonly children: React.ReactNode;
    readonly title: string;
  }) => <main data-title={props.title}>{props.children}</main>,
}));

import Page from "@/app/account/customers/new/page";

describe("new customer page", () => {
  it("protects before rendering the create form", async () => {
    protect.mockResolvedValueOnce({ userId: "user_123" });
    const element = await Page();

    expect(protect).toHaveBeenCalledOnce();
    expect(element.props.title).toBe("New customer");
    expect(element.props.children.props.submitLabel).toBe("Create customer");
  });
});

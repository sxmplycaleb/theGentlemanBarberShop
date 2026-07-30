import { beforeEach, describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({ protect: vi.fn() }));
const { notFound } = vi.hoisted(() => ({ notFound: vi.fn() }));
const repositories = vi.hoisted(() => ({ getCustomerById: vi.fn() }));

vi.mock("@clerk/nextjs/server", () => ({ auth: { protect } }));
vi.mock("next/navigation", () => ({ notFound }));
vi.mock("@/features/customers/actions/customer.actions", () => ({
  updateCustomerAction: vi.fn(),
}));
vi.mock("@/features/customers/data/customer.repository", () => repositories);
vi.mock("@/features/customers/presentation/customer-form", () => ({
  CustomerForm: (props: {
    readonly customer: { readonly id: string };
    readonly submitLabel: string;
  }) => <form data-customer-id={props.customer.id}>{props.submitLabel}</form>,
}));
vi.mock("@/features/customers/presentation/customer-form-page", () => ({
  CustomerFormPage: (props: {
    readonly children: React.ReactNode;
    readonly title: string;
  }) => <main data-title={props.title}>{props.children}</main>,
}));

import Page from "@/app/account/customers/[customerId]/edit/page";

const customerId = "8dbfcfda-7011-4ee8-a0d4-caf0a02c3de2";
const customer = {
  deleted_at: null,
  email: "alex@example.com",
  full_name: "Alex Mwangi",
  id: customerId,
  is_active: true,
  notes: "Regular customer",
  phone_number: "+254700000000",
};

describe("edit customer page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("protects and loads a current customer", async () => {
    protect.mockResolvedValueOnce({ userId: "user_123" });
    repositories.getCustomerById.mockResolvedValueOnce(customer);

    const element = await Page({
      params: Promise.resolve({ customerId }),
    });

    expect(protect).toHaveBeenCalledOnce();
    expect(repositories.getCustomerById).toHaveBeenCalledWith(customerId);
    expect(element.props.title).toBe("Edit customer");
    expect(element.props.children.props.customer).toEqual({
      email: "alex@example.com",
      full_name: "Alex Mwangi",
      is_active: true,
      notes: "Regular customer",
      phone_number: "+254700000000",
    });
  });

  it("returns not found for invalid identifiers", async () => {
    notFound.mockImplementationOnce(() => {
      throw new Error("not found");
    });

    await expect(
      Page({ params: Promise.resolve({ customerId: "invalid" }) }),
    ).rejects.toThrow("not found");
    expect(repositories.getCustomerById).not.toHaveBeenCalled();
  });

  it("returns not found for missing or deleted customers", async () => {
    notFound.mockImplementation(() => {
      throw new Error("not found");
    });
    repositories.getCustomerById.mockResolvedValueOnce(null);
    await expect(
      Page({ params: Promise.resolve({ customerId }) }),
    ).rejects.toThrow("not found");

    repositories.getCustomerById.mockResolvedValueOnce({
      ...customer,
      deleted_at: "2026-07-30T01:00:00.000Z",
    });
    await expect(
      Page({ params: Promise.resolve({ customerId }) }),
    ).rejects.toThrow("not found");
  });
});

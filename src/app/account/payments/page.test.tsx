import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authProtect: vi.fn(),
  listPayments: vi.fn(),
}));
vi.mock("@clerk/nextjs/server", () => ({
  auth: { protect: mocks.authProtect },
}));
vi.mock("@clerk/nextjs", () => ({ UserButton: () => null }));
vi.mock("@/features/payments/data/payment.repository", () => ({
  listPayments: mocks.listPayments,
}));

import Page from "@/app/account/payments/page";

describe("payment management page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authProtect.mockResolvedValue({ userId: "user_123" });
    mocks.listPayments.mockResolvedValue({
      data: [],
      pagination: { page: 1, pageCount: 1, pageSize: 10, total: 0 },
    });
  });

  it("protects, parses URL state, and loads one paginated payment query", async () => {
    const element = await Page({
      searchParams: Promise.resolve({ method: "mpesa", page: "2" }),
    });
    expect(mocks.authProtect).toHaveBeenCalledOnce();
    expect(mocks.listPayments).toHaveBeenCalledWith(
      expect.objectContaining({ method: "mpesa", page: 2 }),
    );
    expect(element.props.filters).toMatchObject({ method: "mpesa", page: 2 });
  });
});

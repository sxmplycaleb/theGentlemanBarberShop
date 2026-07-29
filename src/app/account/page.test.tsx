import { describe, expect, it, vi } from "vitest";

const { protect } = vi.hoisted(() => ({
  protect: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect,
  },
}));

vi.mock("@/features/auth/presentation/account-page", () => ({
  AccountPage: ({ userId }: { readonly userId: string }) => (
    <main>Account {userId}</main>
  ),
}));

import Page from "@/app/account/page";

describe("account page", () => {
  it("protects the page with Clerk before rendering", async () => {
    protect.mockResolvedValueOnce({ userId: "user_123" });

    const element = await Page();

    expect(protect).toHaveBeenCalledOnce();
    expect(element.props.userId).toBe("user_123");
  });
});

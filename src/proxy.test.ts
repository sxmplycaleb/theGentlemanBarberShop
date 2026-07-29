import { describe, expect, it, vi } from "vitest";

const clerkProxy = vi.fn(() => new Response(null, { status: 204 }));
const clerkMiddleware = vi.fn(() => clerkProxy);
const accountMatcher = vi.fn(() => false);
const clerkRouteMatcher = vi.fn(() => false);
const createRouteMatcher = vi
  .fn()
  .mockReturnValueOnce(accountMatcher)
  .mockReturnValueOnce(clerkRouteMatcher);

vi.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware,
  createRouteMatcher,
}));

describe("proxy", () => {
  it("configures Clerk middleware with strict CSP integration", async () => {
    const { clerkContentSecurityPolicy } = await import("@/config/security");
    await import("@/proxy");

    expect(createRouteMatcher).toHaveBeenCalledWith(["/account(.*)"]);
    expect(createRouteMatcher).toHaveBeenCalledWith(["/__clerk(.*)"]);
    expect(clerkMiddleware).toHaveBeenCalledWith(expect.any(Function), {
      contentSecurityPolicy: clerkContentSecurityPolicy,
    });
  });

  it("matches pages and Clerk frontend API routes", async () => {
    const { config } = await import("@/proxy");

    expect(config.matcher).toContain("/__clerk/(.*)");
    expect(config.matcher[0]).toContain("_next");
    expect(config.matcher[0]).toContain("(?!api");
    expect(config.matcher).not.toContain("/(api|trpc)(.*)");
  });

  it("applies a local nonce CSP to public page routes", async () => {
    const { default: proxy } = await import("@/proxy");
    const response = await proxy(
      new Request("https://example.com/") as never,
      {} as never,
    );

    expect(response).toBeInstanceOf(Response);
    if (!response) {
      throw new Error("Expected public proxy response.");
    }

    expect(response.headers.get("Content-Security-Policy")).toContain(
      "script-src 'self' 'nonce-",
    );
    expect(clerkProxy).not.toHaveBeenCalled();
  });
});

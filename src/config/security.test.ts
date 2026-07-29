import { describe, expect, it } from "vitest";

import {
  buildContentSecurityPolicy,
  clerkContentSecurityPolicy,
} from "@/config/security";

describe("clerkContentSecurityPolicy", () => {
  it("uses Clerk strict CSP with the foundation security directives", () => {
    expect(clerkContentSecurityPolicy.strict).toBe(true);
    expect(clerkContentSecurityPolicy.directives).toMatchObject({
      "base-uri": ["'self'"],
      "frame-ancestors": ["'none'"],
      "object-src": ["'none'"],
    });
  });

  it("allows local image sources already supported by the foundation", () => {
    expect(clerkContentSecurityPolicy.directives?.["img-src"]).toEqual([
      "data:",
      "blob:",
    ]);
  });
});

describe("buildContentSecurityPolicy", () => {
  it("builds a nonce-based production policy without unsafe inline sources", () => {
    const policy = buildContentSecurityPolicy("test-nonce");

    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("script-src 'self' 'nonce-test-nonce'");
    expect(policy).toContain("style-src 'self' 'nonce-test-nonce'");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).not.toContain("'unsafe-inline'");
  });

  it("allows Clerk browser resources without exposing a secret", () => {
    const policy = buildContentSecurityPolicy("test-nonce");

    expect(policy).toContain("https://*.clerk.accounts.dev");
    expect(policy).toContain("https://*.clerk.com");
    expect(policy).not.toContain("CLERK_SECRET_KEY");
  });
});

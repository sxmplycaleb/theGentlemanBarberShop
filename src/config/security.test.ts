import { describe, expect, it } from "vitest";

import { buildContentSecurityPolicy } from "@/config/security";

describe("buildContentSecurityPolicy", () => {
  it("builds a nonce-based production policy without unsafe inline sources", () => {
    const policy = buildContentSecurityPolicy("test-nonce");

    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("script-src 'self' 'nonce-test-nonce'");
    expect(policy).toContain("style-src 'self' 'nonce-test-nonce'");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).not.toContain("'unsafe-inline'");
  });
});

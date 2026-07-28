import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { config, proxy } from "@/proxy";

describe("proxy", () => {
  it("applies a per-request CSP nonce to matched pages", () => {
    const response = proxy(new NextRequest("https://example.com/"));
    const policy = response.headers.get("Content-Security-Policy");

    expect(policy).toContain("script-src 'self' 'nonce-");
    expect(policy).toContain("style-src 'self' 'nonce-");
    expect(policy).not.toContain("'unsafe-inline'");
  });

  it("does not match health API routes", () => {
    expect(config.matcher[0]?.source).toContain("(?!api");
  });
});

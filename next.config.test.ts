import { describe, expect, it } from "vitest";

import nextConfig from "./next.config";

describe("nextConfig", () => {
  it("applies non-CSP security headers without exposing the framework header", async () => {
    const headers =
      typeof nextConfig.headers === "function"
        ? await nextConfig.headers()
        : [];

    expect(nextConfig.poweredByHeader).toBe(false);
    expect(headers[0]?.headers).toEqual(
      expect.arrayContaining([
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ]),
    );
    expect(headers[0]?.headers).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "Content-Security-Policy" }),
      ]),
    );
  });
});

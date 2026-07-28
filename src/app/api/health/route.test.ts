import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns a non-cacheable healthy response", async () => {
    const response = GET();
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(body).toEqual({
      data: {
        service: "The Gentleman BarberShop and Spa",
        status: "ok",
        version: "0.1.0",
      },
      success: true,
    });
  });
});

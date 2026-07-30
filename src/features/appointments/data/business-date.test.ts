import { describe, expect, it } from "vitest";

import { resolveBusinessDate } from "@/features/appointments/data/business-date";

describe("resolveBusinessDate", () => {
  it("uses the supplied business timezone", () => {
    const now = new Date("2026-08-10T22:30:00.000Z");
    expect(resolveBusinessDate("Africa/Nairobi", now)).toBe("2026-08-11");
    expect(resolveBusinessDate("America/New_York", now)).toBe("2026-08-10");
  });
});

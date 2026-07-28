import { describe, expect, it } from "vitest";

import * as healthRoute from "@/app/api/health/route";

describe("health route methods", () => {
  it("exposes only the Milestone 0 GET handler", () => {
    expect(Object.keys(healthRoute)).toEqual(["GET"]);
  });
});

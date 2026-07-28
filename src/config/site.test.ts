import { describe, expect, it } from "vitest";

import { APP_NAME, APP_VERSION } from "@/constants/app";
import { siteConfig } from "@/config/site";

describe("siteConfig", () => {
  it("contains only public foundation metadata", () => {
    expect(siteConfig).toEqual({
      name: APP_NAME,
      version: APP_VERSION,
    });
  });
});

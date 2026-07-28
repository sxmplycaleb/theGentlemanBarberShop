import { describe, expect, it } from "vitest";

import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  it("sets the foundation metadata title", () => {
    expect(metadata.title).toBe("The Gentleman BarberShop and Spa");
  });

  it("wraps children in an English document shell", () => {
    const element = RootLayout({ children: <main>Foundation</main> });

    expect(element.type).toBe("html");
    expect(element.props.lang).toBe("en");
    expect(element.props.children.type).toBe("body");
  });
});

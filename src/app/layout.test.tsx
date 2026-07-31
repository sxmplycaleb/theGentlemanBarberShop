import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({
    children,
    dynamic,
  }: {
    readonly children: React.ReactNode;
    readonly dynamic?: boolean;
  }) => <section data-dynamic={String(dynamic)}>{children}</section>,
}));

import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  it("sets the foundation metadata title", () => {
    expect(metadata.title).toBe("The Gentleman BarberShop and Spa");
  });

  it("wraps children in an English document shell", () => {
    const element = RootLayout({ children: <main>Foundation</main> });

    expect(element.type).toBe("html");
    expect(element.props.lang).toBe("en");
    const children = element.props.children as React.ReactElement<{
      children: React.ReactElement<{
        children?: React.ReactNode;
        id?: string;
      }>;
    }>[];
    const body = children.find((child) => child.type === "body");
    expect(body).toBeDefined();
    expect(body?.props.children.props.children).toEqual(
      <main>Foundation</main>,
    );
  });

  it("installs the hydration-safe theme initializer", () => {
    const element = RootLayout({ children: <main>Foundation</main> });
    const children = element.props.children as React.ReactElement<{
      children: React.ReactElement<{ id?: string }>;
    }>[];
    const head = children.find((child) => child.type === "head");
    expect(head?.props.children.props.id).toBe("theme-initializer");
  });
});

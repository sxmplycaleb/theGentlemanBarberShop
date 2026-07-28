import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button, buttonVariants } from "@/components/ui/button";

describe("Button", () => {
  it("renders a native button with the default variant", () => {
    render(<Button>Book now</Button>);

    expect(screen.getByRole("button", { name: "Book now" })).toHaveClass(
      "bg-primary",
    );
  });

  it("can render as a child component for links", () => {
    render(
      <Button asChild variant="outline">
        <a href="/appointments">Appointments</a>
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Appointments" })).toHaveClass(
      "border-border",
    );
  });

  it("exposes stable variant class composition", () => {
    expect(buttonVariants({ size: "icon", variant: "outline" })).toContain(
      "size-11",
    );
  });
});

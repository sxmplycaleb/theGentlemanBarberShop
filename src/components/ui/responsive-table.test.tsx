import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResponsiveTable } from "@/components/ui/responsive-table";

describe("ResponsiveTable", () => {
  it("contains wide tables in a labelled keyboard-focusable region", () => {
    render(
      <ResponsiveTable label="Customers">
        <table>
          <tbody>
            <tr>
              <td>Alex</td>
            </tr>
          </tbody>
        </table>
      </ResponsiveTable>,
    );

    expect(screen.getByRole("region", { name: "Customers" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("table")).toBeVisible();
  });
});

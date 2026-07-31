import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, vi } from "vitest";

vi.mock("@clerk/nextjs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@clerk/nextjs")>();
  return {
    ...actual,
    UserButton: () =>
      createElement("div", {
        "aria-label": "User profile",
        "data-testid": "user-button",
      }),
  };
});

vi.mock("next/navigation", () => ({
  usePathname: () => "/account",
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth/presentation/sign-in-page", () => ({
  SignInPage: () => <main>Sign in</main>,
}));

import Page from "@/app/sign-in/[[...sign-in]]/page";

describe("sign-in page route", () => {
  it("renders the auth feature sign-in page", () => {
    const element = Page();

    expect(element.type.name).toBe("SignInPage");
  });
});

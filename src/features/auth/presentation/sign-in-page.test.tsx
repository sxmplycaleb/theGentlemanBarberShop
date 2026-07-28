import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { signIn } = vi.hoisted(() => ({
  signIn: vi.fn(),
}));

vi.mock("@clerk/nextjs", () => ({
  SignIn: (props: unknown) => {
    signIn(props);

    return (
      <div data-testid="clerk-sign-in">
        <button type="button">Continue with Google</button>
      </div>
    );
  },
}));

import { SignInPage } from "@/features/auth/presentation/sign-in-page";

describe("SignInPage", () => {
  it("renders the branded Clerk sign-in surface", () => {
    render(<SignInPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "The Gentleman BarberShop and Spa",
      }),
    ).toBeVisible();
    expect(screen.getByTestId("clerk-sign-in")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue with Google" }),
    ).toBeVisible();
  });

  it("configures Clerk sign-in for Google OAuth and redirects", () => {
    render(<SignInPage />);

    expect(signIn).toHaveBeenCalledWith(
      expect.objectContaining({
        appearance: expect.objectContaining({
          elements: expect.objectContaining({
            socialButtonsBlockButton__google: expect.stringContaining("border"),
            socialButtonsProviderIcon__google: "size-5",
          }),
        }),
        fallbackRedirectUrl: "/",
        oauthFlow: "redirect",
        signUpFallbackRedirectUrl: "/",
      }),
    );
  });
});

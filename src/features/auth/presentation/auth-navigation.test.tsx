import { render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({
    children,
    fallbackRedirectUrl,
  }: {
    readonly children: React.ReactNode;
    readonly fallbackRedirectUrl?: string;
  }) => (
    <div
      data-fallback-redirect-url={fallbackRedirectUrl}
      data-testid="sign-in-button"
    >
      {children}
    </div>
  ),
  SignOutButton: ({
    children,
    redirectUrl,
  }: {
    readonly children: React.ReactNode;
    readonly redirectUrl?: string;
  }) => <div data-redirect-url={redirectUrl}>{children}</div>,
  UserButton: () => <div data-testid="user-button" />,
  useUser: vi.fn(() => ({
    isSignedIn: false,
  })),
}));

import { useUser } from "@clerk/nextjs";

import { AuthNavigation } from "@/features/auth/presentation/auth-navigation";

const mockedUseUser = vi.mocked(useUser);

describe("AuthNavigation", () => {
  it("renders the Clerk sign-in control for anonymous visitors", () => {
    mockedUseUser.mockReturnValue({
      isSignedIn: false,
    } as ReturnType<typeof useUser>);

    render(<AuthNavigation />);

    expect(
      screen.getByRole("navigation", { name: "Authentication" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeVisible();
    expect(screen.getByTestId("sign-in-button")).toHaveAttribute(
      "data-fallback-redirect-url",
      "/",
    );
  });

  it("renders account and sign-out controls for signed-in visitors", () => {
    mockedUseUser.mockReturnValue({
      isSignedIn: true,
    } as ReturnType<typeof useUser>);

    render(<AuthNavigation />);

    expect(screen.getByRole("link", { name: /account/i })).toHaveAttribute(
      "href",
      "/account",
    );
    expect(screen.getByRole("button", { name: /sign out/i })).toBeVisible();
    expect(
      screen.getByRole("button", { name: /sign out/i }).parentElement,
    ).toHaveAttribute("data-redirect-url", "/");
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });
});

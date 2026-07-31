"use client";

import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { LogIn, LogOut, UserRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const postSignInUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ?? "/";
const postSignOutUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL ?? "/";

export function AuthNavigation() {
  const { isSignedIn } = useUser();

  return (
    <nav
      aria-label="Authentication"
      className="flex items-center gap-1 sm:gap-2"
    >
      {isSignedIn ? (
        <>
          <Button asChild size="sm" variant="outline">
            <Link href="/account" prefetch={false}>
              <UserRound
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.75}
              />
              <span className="hidden sm:inline">Account</span>
              <span className="sr-only sm:hidden">Account</span>
            </Link>
          </Button>
          <SignOutButton redirectUrl={postSignOutUrl}>
            <Button size="sm" type="button" variant="outline">
              <LogOut
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.75}
              />
              <span className="hidden sm:inline">Sign out</span>
              <span className="sr-only sm:hidden">Sign out</span>
            </Button>
          </SignOutButton>
          <UserButton />
        </>
      ) : (
        <SignInButton fallbackRedirectUrl={postSignInUrl} mode="redirect">
          <Button size="sm" type="button" variant="outline">
            <LogIn aria-hidden="true" className="size-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Sign in</span>
            <span className="sr-only sm:hidden">Sign in</span>
          </Button>
        </SignInButton>
      )}
    </nav>
  );
}

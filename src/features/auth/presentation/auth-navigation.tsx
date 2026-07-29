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
    <nav aria-label="Authentication" className="flex items-center gap-3">
      {isSignedIn ? (
        <>
          <Button asChild variant="outline">
            <Link href="/account" prefetch={false}>
              <UserRound
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.75}
              />
              Account
            </Link>
          </Button>
          <SignOutButton redirectUrl={postSignOutUrl}>
            <Button type="button" variant="outline">
              <LogOut
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.75}
              />
              Sign out
            </Button>
          </SignOutButton>
          <UserButton />
        </>
      ) : (
        <SignInButton fallbackRedirectUrl={postSignInUrl} mode="redirect">
          <Button type="button" variant="outline">
            <LogIn aria-hidden="true" className="size-4" strokeWidth={1.75} />
            Sign in
          </Button>
        </SignInButton>
      )}
    </nav>
  );
}

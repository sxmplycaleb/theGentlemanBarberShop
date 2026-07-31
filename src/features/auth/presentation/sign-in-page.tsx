import { SignIn } from "@clerk/nextjs";
import { Scissors } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { APP_NAME } from "@/constants/app";

const postSignInUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ?? "/";
const postSignUpUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ?? "/";

export function SignInPage() {
  return (
    <main className="bg-background text-foreground grid min-h-dvh place-items-center px-4 py-10 sm:px-6">
      <section
        aria-labelledby="sign-in-heading"
        className="flex w-full max-w-md flex-col items-center gap-6"
      >
        <div className="flex w-full items-start justify-between gap-4">
          <span className="bg-primary text-primary-foreground grid size-11 place-items-center rounded-md shadow-sm">
            <Scissors aria-hidden="true" className="size-5" />
          </span>
          <ThemeToggle />
        </div>
        <div className="w-full text-left">
          <p className="text-primary mb-3 text-sm font-semibold">
            Secure access
          </p>
          <h1
            className="font-serif text-4xl leading-tight font-semibold tracking-tight"
            id="sign-in-heading"
          >
            {APP_NAME}
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            Sign in to manage daily barbershop operations.
          </p>
        </div>
        <Card className="w-full shadow-md">
          <CardContent>
            <SignIn
              appearance={{
                elements: {
                  card: "shadow-none bg-transparent border-0 p-0",
                  socialButtonsBlockButton__google:
                    "border-border bg-card text-foreground hover:bg-muted min-h-11",
                  socialButtonsProviderIcon__google: "size-5",
                },
              }}
              fallbackRedirectUrl={postSignInUrl}
              oauthFlow="redirect"
              signUpFallbackRedirectUrl={postSignUpUrl}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

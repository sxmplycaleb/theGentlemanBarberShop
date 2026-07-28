import { SignIn } from "@clerk/nextjs";

import { APP_NAME } from "@/constants/app";

const postSignInUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ?? "/";
const postSignUpUrl =
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ?? "/";

export function SignInPage() {
  return (
    <main className="bg-background text-foreground grid min-h-dvh place-items-center px-6 py-10">
      <section
        aria-labelledby="sign-in-heading"
        className="flex w-full max-w-md flex-col items-center gap-8"
      >
        <div className="text-center">
          <p className="text-accent-foreground mb-3 text-sm font-medium">
            Secure access
          </p>
          <h1
            className="font-serif text-4xl leading-tight font-semibold"
            id="sign-in-heading"
          >
            {APP_NAME}
          </h1>
        </div>
        <SignIn
          appearance={{
            elements: {
              socialButtonsBlockButton__google:
                "border-border bg-card text-foreground hover:bg-muted",
              socialButtonsProviderIcon__google: "size-5",
            },
          }}
          fallbackRedirectUrl={postSignInUrl}
          oauthFlow="redirect"
          signUpFallbackRedirectUrl={postSignUpUrl}
        />
      </section>
    </main>
  );
}

import { UserButton } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";

import { APP_NAME } from "@/constants/app";

interface AccountPageProps {
  readonly userId: string;
}

export function AccountPage({ userId }: AccountPageProps) {
  return (
    <main className="bg-background text-foreground min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="border-border flex items-center justify-between border-b pb-6">
          <div>
            <p className="text-muted-foreground text-sm">{APP_NAME}</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold">Account</h1>
          </div>
          <UserButton />
        </header>

        <section className="grid flex-1 place-items-center py-16">
          <div className="border-border bg-card flex w-full max-w-xl items-start gap-4 border p-6">
            <span className="border-border grid size-11 shrink-0 place-items-center border">
              <ShieldCheck
                aria-hidden="true"
                className="size-5"
                strokeWidth={1.75}
              />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Signed in</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Clerk is managing the active session for this browser.
              </p>
              <p className="text-muted-foreground mt-4 text-xs break-all">
                Session user: {userId}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Contact,
  Scissors,
  Settings2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
          <div className="grid w-full max-w-xl gap-4">
            <div className="border-border bg-card flex items-start gap-4 border p-6">
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
            <div className="border-border bg-card flex items-center justify-between gap-4 border p-6">
              <div className="flex items-center gap-4">
                <span className="border-border grid size-11 shrink-0 place-items-center border">
                  <Scissors
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={1.75}
                  />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">Services</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Manage categories and services.
                  </p>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href="/account/services">Open</Link>
              </Button>
            </div>
            <div className="border-border bg-card flex items-center justify-between gap-4 border p-6">
              <div className="flex items-center gap-4">
                <span className="border-border grid size-11 shrink-0 place-items-center border">
                  <UsersRound
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={1.75}
                  />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">Staff</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Manage team member profiles.
                  </p>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href="/account/staff">Open</Link>
              </Button>
            </div>
            <div className="border-border bg-card flex items-center justify-between gap-4 border p-6">
              <div className="flex items-center gap-4">
                <span className="border-border grid size-11 shrink-0 place-items-center border">
                  <Contact
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={1.75}
                  />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">Customers</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Manage customer profiles.
                  </p>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href="/account/customers">Open</Link>
              </Button>
            </div>
            <div className="border-border bg-card flex items-center justify-between gap-4 border p-6">
              <div className="flex items-center gap-4">
                <span className="border-border grid size-11 shrink-0 place-items-center border">
                  <Settings2
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={1.75}
                  />
                </span>
                <div>
                  <h2 className="text-lg font-semibold">Business settings</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Manage business details and defaults.
                  </p>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href="/account/settings">Open</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

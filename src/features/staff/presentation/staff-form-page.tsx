import { UserButton } from "@clerk/nextjs";
import { UsersRound } from "lucide-react";

import { APP_NAME } from "@/constants/app";

interface StaffFormPageProps {
  readonly children: React.ReactNode;
  readonly title: string;
}

export function StaffFormPage({ children, title }: StaffFormPageProps) {
  return (
    <main className="bg-background text-foreground min-h-dvh">
      <div className="mx-auto grid min-h-dvh w-full max-w-3xl gap-8 px-6 py-8 sm:px-10 lg:px-12">
        <header className="border-border flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-4">
            <span className="border-border bg-card grid size-11 place-items-center border">
              <UsersRound aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-muted-foreground text-sm">{APP_NAME}</p>
              <h1 className="mt-2 font-serif text-4xl font-semibold">
                {title}
              </h1>
            </div>
          </div>
          <UserButton />
        </header>
        <section className="border-border bg-card border p-6">
          {children}
        </section>
      </div>
    </main>
  );
}

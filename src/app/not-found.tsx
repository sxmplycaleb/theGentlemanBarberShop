import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="bg-background text-foreground grid min-h-dvh place-items-center px-6">
      <section className="border-border w-full max-w-xl border-y py-12 text-center">
        <p className="text-accent-foreground text-sm font-medium">404</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold">
          Page not found
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md leading-7">
          The requested page is unavailable.
        </p>
        <Link className={buttonVariants({ className: "mt-8" })} href="/">
          Return home
        </Link>
      </section>
    </main>
  );
}

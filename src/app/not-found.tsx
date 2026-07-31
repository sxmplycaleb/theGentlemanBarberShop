import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="bg-background text-foreground grid min-h-dvh place-items-center px-4">
      <section className="border-border bg-card w-full max-w-xl rounded-lg border p-8 text-center shadow-md sm:p-12">
        <p className="text-primary text-sm font-semibold">404</p>
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

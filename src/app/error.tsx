"use client";

import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  readonly reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="bg-background text-foreground grid min-h-dvh place-items-center px-6">
      <section className="border-border w-full max-w-xl border-y py-12 text-center">
        <p className="text-accent-foreground text-sm font-medium">
          Service interrupted
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md leading-7">
          The page could not be completed. Please try the request again.
        </p>
        <Button className="mt-8" onClick={reset} type="button">
          Try again
        </Button>
      </section>
    </main>
  );
}

import { ArrowRight, Scissors, ShieldCheck, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { APP_NAME } from "@/constants/app";
import { AuthNavigation } from "@/features/auth/presentation/auth-navigation";
import { FOUNDATION_STATUS } from "@/features/foundation/constants/foundation.constants";

export function FoundationPage() {
  return (
    <main className="bg-background text-foreground relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-primary/8 absolute top-0 right-0 -z-0 size-[32rem] translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl"
      />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <header className="border-border bg-background/85 flex flex-wrap items-center justify-between gap-4 rounded-lg border px-4 py-3 shadow-sm backdrop-blur-xl sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-md shadow-sm">
              <Scissors aria-hidden="true" className="size-5" />
            </span>
            <span className="truncate text-sm font-semibold tracking-[0.12em] uppercase">
              The Gentleman
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AuthNavigation />
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_24rem] lg:py-20">
          <div className="max-w-3xl">
            <p className="text-primary flex items-center gap-2 text-sm font-semibold">
              <Sparkles aria-hidden="true" className="size-4" />
              Premium grooming. Considered service.
            </p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              {APP_NAME}
            </h1>
            <p className="text-muted-foreground mt-7 max-w-2xl text-lg leading-8">
              A refined operations platform built for precise appointments,
              thoughtful service, and an exceptional customer experience.
            </p>
            <div className="text-muted-foreground mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <span className="flex items-center gap-2">
                <ShieldCheck
                  aria-hidden="true"
                  className="text-success size-4"
                />
                Secure operations
              </span>
              <span className="flex items-center gap-2">
                <ArrowRight
                  aria-hidden="true"
                  className="text-primary size-4"
                />
                Designed for daily flow
              </span>
            </div>
          </div>

          <Card className="bg-card/92 shadow-md backdrop-blur">
            <CardContent>
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">
                Platform status
              </p>
              <dl className="mt-5">
                {FOUNDATION_STATUS.map((item) => (
                  <div
                    className="border-border grid grid-cols-2 gap-4 border-b py-4 text-sm last:border-b-0"
                    key={item.label}
                  >
                    <dt className="text-muted-foreground">{item.label}</dt>
                    <dd className="text-right font-semibold">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </section>

        <footer className="border-border text-muted-foreground flex flex-col gap-3 border-t py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>Precision in every detail.</span>
          <span>{APP_NAME}</span>
        </footer>
      </div>
    </main>
  );
}

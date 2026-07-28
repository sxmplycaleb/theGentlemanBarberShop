import { Scissors } from "lucide-react";

import { APP_NAME } from "@/constants/app";
import { FOUNDATION_STATUS } from "@/features/foundation/constants/foundation.constants";

export function FoundationPage() {
  return (
    <main className="bg-background text-foreground min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="border-border flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-3">
            <span className="border-border bg-card grid size-10 place-items-center border">
              <Scissors
                aria-hidden="true"
                className="size-5"
                strokeWidth={1.5}
              />
            </span>
            <span className="text-sm font-semibold tracking-[0.16em] uppercase">
              {APP_NAME}
            </span>
          </div>
          <span className="text-muted-foreground text-xs">
            Premium grooming
          </span>
        </header>

        <section className="grid flex-1 items-end gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:py-20">
          <div className="max-w-3xl">
            <p className="text-accent-foreground mb-5 text-sm font-medium">
              Premium grooming. Considered service.
            </p>
            <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
              {APP_NAME}
            </h1>
            <p className="text-muted-foreground mt-7 max-w-xl text-base leading-7 sm:text-lg">
              A refined digital foundation for a premium grooming experience.
            </p>
          </div>

          <dl className="border-border border-t">
            {FOUNDATION_STATUS.map((item) => (
              <div
                className="border-border grid grid-cols-2 gap-4 border-b py-4 text-sm"
                key={item.label}
              >
                <dt className="text-muted-foreground">{item.label}</dt>
                <dd className="text-right font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="border-border text-muted-foreground flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>Precision in every detail.</span>
          <span>{APP_NAME}</span>
        </footer>
      </div>
    </main>
  );
}

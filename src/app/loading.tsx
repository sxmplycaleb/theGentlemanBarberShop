import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading"
      className="bg-background text-foreground min-h-dvh px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col">
        <div className="border-border bg-card flex items-center gap-3 rounded-lg border p-4 shadow-sm">
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="h-4 w-44" />
        </div>
        <div className="flex flex-1 flex-col justify-end gap-5 py-16 lg:py-20">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-16 w-full max-w-3xl sm:h-20" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>
      </div>
    </main>
  );
}

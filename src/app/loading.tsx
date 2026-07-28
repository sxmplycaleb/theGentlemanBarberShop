import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading"
      className="bg-background text-foreground min-h-dvh px-6 py-8 sm:px-10 lg:px-12"
    >
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col">
        <div className="border-border flex items-center gap-3 border-b pb-6">
          <Skeleton className="size-10" />
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

import Link from "next/link";

import { Button } from "@/components/ui/button";

export interface PaginationMeta {
  readonly page: number;
  readonly pageCount: number;
  readonly pageSize: number;
  readonly total: number;
}

interface PaginationProps {
  readonly pageParam: string;
  readonly pagination: PaginationMeta;
  readonly searchParams: URLSearchParams;
}

export function Pagination({
  pageParam,
  pagination,
  searchParams,
}: PaginationProps) {
  const previousParams = new URLSearchParams(searchParams);
  const nextParams = new URLSearchParams(searchParams);

  previousParams.set(pageParam, String(Math.max(1, pagination.page - 1)));
  nextParams.set(
    pageParam,
    String(Math.min(pagination.pageCount, pagination.page + 1)),
  );

  return (
    <nav
      aria-label={`${pageParam} pagination`}
      className="border-border bg-card flex flex-col gap-3 rounded-lg border px-4 py-3 text-sm shadow-xs sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-muted-foreground">
        Page {pagination.page} of {pagination.pageCount} &middot;{" "}
        {pagination.total} records
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Button
          asChild
          className={pagination.page <= 1 ? "pointer-events-none" : ""}
          variant="outline"
        >
          <Link
            aria-disabled={pagination.page <= 1}
            href={`?${previousParams}`}
          >
            Previous
          </Link>
        </Button>
        <Button
          asChild
          className={
            pagination.page >= pagination.pageCount ? "pointer-events-none" : ""
          }
          variant="outline"
        >
          <Link
            aria-disabled={pagination.page >= pagination.pageCount}
            href={`?${nextParams}`}
          >
            Next
          </Link>
        </Button>
      </div>
    </nav>
  );
}

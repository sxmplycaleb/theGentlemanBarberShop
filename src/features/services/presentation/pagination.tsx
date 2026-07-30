import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/features/services/types/service-management.types";

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
      className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-muted-foreground">
        Page {pagination.page} of {pagination.pageCount} · {pagination.total}{" "}
        records
      </p>
      <div className="flex gap-2">
        <Button
          asChild
          className={
            pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
          }
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
            pagination.page >= pagination.pageCount
              ? "pointer-events-none opacity-50"
              : ""
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

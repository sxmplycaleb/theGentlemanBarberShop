import { UserButton } from "@clerk/nextjs";
import { Scissors } from "lucide-react";

import { APP_NAME } from "@/constants/app";
import { ServiceCategoryList } from "@/features/services/presentation/service-category-list";
import { ServiceList } from "@/features/services/presentation/service-list";
import type {
  CategoryListFilters,
  PaginatedResult,
  ServiceCategoryRow,
  ServiceListFilters,
  ServiceManagementSearchParams,
  ServiceWithCategory,
} from "@/features/services/types/service-management.types";

interface ServiceManagementPageProps {
  readonly categoryFilters: CategoryListFilters;
  readonly categoryResult: PaginatedResult<ServiceCategoryRow>;
  readonly searchParams: ServiceManagementSearchParams;
  readonly serviceFilters: ServiceListFilters;
  readonly serviceResult: PaginatedResult<ServiceWithCategory>;
}

export function ServiceManagementPage({
  categoryFilters,
  categoryResult,
  searchParams,
  serviceFilters,
  serviceResult,
}: ServiceManagementPageProps) {
  return (
    <main className="bg-background text-foreground min-h-dvh">
      <div className="mx-auto grid min-h-dvh w-full max-w-7xl gap-10 px-6 py-8 sm:px-10 lg:px-12">
        <header className="border-border flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-4">
            <span className="border-border bg-card grid size-11 place-items-center border">
              <Scissors aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-muted-foreground text-sm">{APP_NAME}</p>
              <h1 className="mt-2 font-serif text-4xl font-semibold">
                Service management
              </h1>
            </div>
          </div>
          <UserButton />
        </header>

        <div className="grid gap-12">
          <ServiceCategoryList
            filters={categoryFilters}
            result={categoryResult}
            searchParams={searchParams}
          />
          <ServiceList
            filters={serviceFilters}
            result={serviceResult}
            searchParams={searchParams}
          />
        </div>
      </div>
    </main>
  );
}

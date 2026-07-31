import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
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
    <AuthenticatedPageShell
      description="Organize service categories, pricing, duration, and availability."
      title="Service management"
    >
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
    </AuthenticatedPageShell>
  );
}

import { auth } from "@clerk/nextjs/server";

import {
  parseCategoryListFilters,
  parseServiceListFilters,
} from "@/features/services/data/service-management-filters";
import { listServiceCategories } from "@/features/services/data/service-category.repository";
import { listServices } from "@/features/services/data/service.repository";
import { ServiceManagementPage } from "@/features/services/presentation/service-management-page";
import type { ServiceManagementSearchParams } from "@/features/services/types/service-management.types";

interface PageProps {
  readonly searchParams: Promise<ServiceManagementSearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  await auth.protect();

  const resolvedSearchParams = await searchParams;
  const categoryFilters = parseCategoryListFilters(resolvedSearchParams);
  const serviceFilters = parseServiceListFilters(resolvedSearchParams);
  const [categoryResult, serviceResult] = await Promise.all([
    listServiceCategories(categoryFilters),
    listServices(serviceFilters),
  ]);

  return (
    <ServiceManagementPage
      categoryFilters={categoryFilters}
      categoryResult={categoryResult}
      searchParams={resolvedSearchParams}
      serviceFilters={serviceFilters}
      serviceResult={serviceResult}
    />
  );
}

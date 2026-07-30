import { auth } from "@clerk/nextjs/server";

import { parseCustomerListFilters } from "@/features/customers/data/customer-management-filters";
import { listCustomers } from "@/features/customers/data/customer.repository";
import { CustomerManagementPage } from "@/features/customers/presentation/customer-management-page";
import type { CustomerManagementSearchParams } from "@/features/customers/types/customer-management.types";

interface PageProps {
  readonly searchParams: Promise<CustomerManagementSearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  await auth.protect();

  const resolvedSearchParams = await searchParams;
  const filters = parseCustomerListFilters(resolvedSearchParams);
  const result = await listCustomers(filters);

  return (
    <CustomerManagementPage
      filters={filters}
      result={result}
      searchParams={resolvedSearchParams}
    />
  );
}

import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { CustomerList } from "@/features/customers/presentation/customer-list";
import type {
  CustomerListFilters,
  CustomerManagementSearchParams,
  CustomerRow,
  PaginatedResult,
} from "@/features/customers/types/customer-management.types";

interface CustomerManagementPageProps {
  readonly filters: CustomerListFilters;
  readonly result: PaginatedResult<CustomerRow>;
  readonly searchParams: CustomerManagementSearchParams;
}

export function CustomerManagementPage({
  filters,
  result,
  searchParams,
}: CustomerManagementPageProps) {
  return (
    <AuthenticatedPageShell
      description="Keep customer profiles and contact details organized."
      title="Customer management"
    >
      <CustomerList
        filters={filters}
        result={result}
        searchParams={searchParams}
      />
    </AuthenticatedPageShell>
  );
}

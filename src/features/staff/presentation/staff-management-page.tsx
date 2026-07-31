import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { StaffList } from "@/features/staff/presentation/staff-list";
import type {
  PaginatedResult,
  StaffListFilters,
  StaffManagementSearchParams,
  StaffRow,
} from "@/features/staff/types/staff-management.types";

interface StaffManagementPageProps {
  readonly filters: StaffListFilters;
  readonly result: PaginatedResult<StaffRow>;
  readonly searchParams: StaffManagementSearchParams;
}

export function StaffManagementPage({
  filters,
  result,
  searchParams,
}: StaffManagementPageProps) {
  return (
    <AuthenticatedPageShell
      description="Manage team profiles, availability status, and display order."
      title="Staff management"
    >
      <StaffList
        filters={filters}
        result={result}
        searchParams={searchParams}
      />
    </AuthenticatedPageShell>
  );
}

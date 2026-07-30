import { auth } from "@clerk/nextjs/server";

import { parseStaffListFilters } from "@/features/staff/data/staff-management-filters";
import { listStaff } from "@/features/staff/data/staff.repository";
import { StaffManagementPage } from "@/features/staff/presentation/staff-management-page";
import type { StaffManagementSearchParams } from "@/features/staff/types/staff-management.types";

interface PageProps {
  readonly searchParams: Promise<StaffManagementSearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  await auth.protect();

  const resolvedSearchParams = await searchParams;
  const filters = parseStaffListFilters(resolvedSearchParams);
  const result = await listStaff(filters);

  return (
    <StaffManagementPage
      filters={filters}
      result={result}
      searchParams={resolvedSearchParams}
    />
  );
}

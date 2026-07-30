import Link from "next/link";

import { ManagementControls } from "@/components/management/management-controls";
import { Pagination } from "@/components/management/pagination";
import { StatusBadge } from "@/components/management/status-badge";
import { Button } from "@/components/ui/button";
import {
  restoreStaffAction,
  setStaffActiveAction,
  softDeleteStaffAction,
} from "@/features/staff/actions/staff.actions";
import { StaffActionForm } from "@/features/staff/presentation/staff-action-form";
import type {
  PaginatedResult,
  StaffListFilters,
  StaffManagementSearchParams,
  StaffRow,
} from "@/features/staff/types/staff-management.types";

interface StaffListProps {
  readonly filters: StaffListFilters;
  readonly result: PaginatedResult<StaffRow>;
  readonly searchParams: StaffManagementSearchParams;
}

const staffSortOptions = [
  { label: "Display order", value: "display_order" },
  { label: "Name", value: "display_name" },
  { label: "Status", value: "is_active" },
  { label: "Created", value: "created_at" },
  { label: "Updated", value: "updated_at" },
] as const;

function toUrlSearchParams(searchParams: StaffManagementSearchParams) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (typeof value === "string" && value) {
      params.set(key, value);
    }
  });

  return params;
}

export function StaffList({ filters, result, searchParams }: StaffListProps) {
  const urlSearchParams = toUrlSearchParams(searchParams);

  return (
    <section className="grid gap-5" id="staff">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold">Staff</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage team member profiles and display order.
          </p>
        </div>
        <Button asChild>
          <Link href="/account/staff/new">New staff member</Link>
        </Button>
      </div>

      <ManagementControls
        active={filters.active}
        deleted={filters.deleted}
        direction={filters.direction}
        pageName="Staff"
        prefix=""
        search={filters.search}
        sort={filters.sort}
        sortOptions={staffSortOptions}
      />

      <div className="border-border overflow-x-auto border">
        <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Bio</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.data.length ? (
              result.data.map((staff) => (
                <tr className="border-border border-t" key={staff.id}>
                  <td className="px-4 py-4">
                    <div className="font-medium">{staff.display_name}</div>
                    <div className="text-muted-foreground mt-1">
                      {staff.slug}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {staff.phone_number ? (
                      staff.phone_number
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="max-w-80 px-4 py-4">
                    {staff.bio ? (
                      <span className="line-clamp-2">{staff.bio}</span>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="px-4 py-4">{staff.display_order}</td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      deletedAt={staff.deleted_at}
                      isActive={staff.is_active}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline">
                        <Link href={`/account/staff/${staff.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      {staff.deleted_at ? (
                        <StaffActionForm
                          action={restoreStaffAction}
                          fields={[{ name: "id", value: staff.id }]}
                        >
                          Restore
                        </StaffActionForm>
                      ) : (
                        <>
                          <StaffActionForm
                            action={setStaffActiveAction}
                            fields={[
                              { name: "id", value: staff.id },
                              {
                                name: "is_active",
                                value: staff.is_active ? "false" : "true",
                              },
                            ]}
                          >
                            {staff.is_active ? "Deactivate" : "Activate"}
                          </StaffActionForm>
                          <StaffActionForm
                            action={softDeleteStaffAction}
                            fields={[{ name: "id", value: staff.id }]}
                          >
                            Delete
                          </StaffActionForm>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="text-muted-foreground px-4 py-8 text-center"
                  colSpan={6}
                >
                  No staff members match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        pageParam="page"
        pagination={result.pagination}
        searchParams={urlSearchParams}
      />
    </section>
  );
}

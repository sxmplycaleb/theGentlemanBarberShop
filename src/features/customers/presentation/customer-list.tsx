import Link from "next/link";

import { ManagementControls } from "@/components/management/management-controls";
import { Pagination } from "@/components/management/pagination";
import { StatusBadge } from "@/components/management/status-badge";
import { Button } from "@/components/ui/button";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import {
  restoreCustomerAction,
  setCustomerActiveAction,
  softDeleteCustomerAction,
} from "@/features/customers/actions/customer.actions";
import { CustomerActionForm } from "@/features/customers/presentation/customer-action-form";
import type {
  CustomerListFilters,
  CustomerManagementSearchParams,
  CustomerRow,
  PaginatedResult,
} from "@/features/customers/types/customer-management.types";

interface CustomerListProps {
  readonly filters: CustomerListFilters;
  readonly result: PaginatedResult<CustomerRow>;
  readonly searchParams: CustomerManagementSearchParams;
}

const customerSortOptions = [
  { label: "Name", value: "full_name" },
  { label: "Status", value: "is_active" },
  { label: "Created", value: "created_at" },
  { label: "Updated", value: "updated_at" },
] as const;

function toUrlSearchParams(searchParams: CustomerManagementSearchParams) {
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

export function CustomerList({
  filters,
  result,
  searchParams,
}: CustomerListProps) {
  return (
    <section className="grid gap-5" id="customers">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold">Customers</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage customer profiles and contact details.
          </p>
        </div>
        <Button asChild>
          <Link href="/account/customers/new">New customer</Link>
        </Button>
      </div>

      <ManagementControls
        active={filters.active}
        deleted={filters.deleted}
        direction={filters.direction}
        pageName="Customer"
        prefix=""
        search={filters.search}
        searchPlaceholder="Search by name, phone, or email"
        sort={filters.sort}
        sortOptions={customerSortOptions}
      />

      <ResponsiveTable label="Customers">
        <table className="data-table min-w-[64rem] text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Notes</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.data.length ? (
              result.data.map((customer) => (
                <tr className="border-border border-t" key={customer.id}>
                  <td className="px-4 py-4 font-medium">
                    {customer.full_name}
                  </td>
                  <td className="px-4 py-4">
                    {customer.phone_number ?? (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {customer.email ?? (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="max-w-80 px-4 py-4">
                    {customer.notes ? (
                      <span className="line-clamp-2">{customer.notes}</span>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      deletedAt={customer.deleted_at}
                      isActive={customer.is_active}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      {customer.deleted_at ? (
                        <CustomerActionForm
                          action={restoreCustomerAction}
                          fields={[{ name: "id", value: customer.id }]}
                        >
                          Restore
                        </CustomerActionForm>
                      ) : (
                        <>
                          <Button asChild variant="outline">
                            <Link
                              href={`/account/customers/${customer.id}/edit`}
                            >
                              Edit
                            </Link>
                          </Button>
                          <CustomerActionForm
                            action={setCustomerActiveAction}
                            fields={[
                              { name: "id", value: customer.id },
                              {
                                name: "is_active",
                                value: customer.is_active ? "false" : "true",
                              },
                            ]}
                          >
                            {customer.is_active ? "Deactivate" : "Activate"}
                          </CustomerActionForm>
                          <CustomerActionForm
                            action={softDeleteCustomerAction}
                            fields={[{ name: "id", value: customer.id }]}
                          >
                            Delete
                          </CustomerActionForm>
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
                  No customers match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ResponsiveTable>

      <Pagination
        pageParam="page"
        pagination={result.pagination}
        searchParams={toUrlSearchParams(searchParams)}
      />
    </section>
  );
}

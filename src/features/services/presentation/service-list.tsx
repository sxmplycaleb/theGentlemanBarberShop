import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { ManagementControls } from "@/components/management/management-controls";
import { Pagination } from "@/components/management/pagination";
import { StatusBadge } from "@/components/management/status-badge";
import {
  restoreServiceAction,
  setServiceActiveAction,
  softDeleteServiceAction,
} from "@/features/services/actions/service.actions";
import type {
  PaginatedResult,
  ServiceListFilters,
  ServiceManagementSearchParams,
  ServiceWithCategory,
} from "@/features/services/types/service-management.types";

interface ServiceListProps {
  readonly filters: ServiceListFilters;
  readonly result: PaginatedResult<ServiceWithCategory>;
  readonly searchParams: ServiceManagementSearchParams;
}

const serviceSortOptions = [
  { label: "Display order", value: "display_order" },
  { label: "Name", value: "name" },
  { label: "Status", value: "is_active" },
  { label: "Duration", value: "duration_minutes" },
  { label: "Price", value: "price_cents" },
  { label: "Created", value: "created_at" },
  { label: "Updated", value: "updated_at" },
] as const;

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en-KE", {
    currency: "KES",
    style: "currency",
  }).format(priceCents / 100);
}

function toUrlSearchParams(searchParams: ServiceManagementSearchParams) {
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

export function ServiceList({
  filters,
  result,
  searchParams,
}: ServiceListProps) {
  const urlSearchParams = toUrlSearchParams(searchParams);

  return (
    <section className="grid gap-5" id="services">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold">Services</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage ordered service definitions and image URLs.
          </p>
        </div>
        <Button asChild>
          <Link href="/account/services/new">New service</Link>
        </Button>
      </div>

      <ManagementControls
        active={filters.active}
        deleted={filters.deleted}
        direction={filters.direction}
        pageName="Service"
        prefix="s"
        search={filters.search}
        sort={filters.sort}
        sortOptions={serviceSortOptions}
      />

      <ResponsiveTable label="Services">
        <table className="data-table min-w-[64rem] text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.data.length ? (
              result.data.map((service) => (
                <tr className="border-border border-t" key={service.id}>
                  <td className="px-4 py-4">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-muted-foreground mt-1">
                      {service.slug}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {service.category ? (
                      <span>
                        {service.category.name}
                        {service.category.deleted_at ? " (deleted)" : ""}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Unknown</span>
                    )}
                  </td>
                  <td className="px-4 py-4">{service.duration_minutes} min</td>
                  <td className="px-4 py-4">
                    {formatPrice(service.price_cents)}
                  </td>
                  <td className="px-4 py-4">{service.display_order}</td>
                  <td className="max-w-48 truncate px-4 py-4">
                    {service.image_url ? (
                      <a
                        className="text-primary underline-offset-4 hover:underline"
                        href={service.image_url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Image URL
                      </a>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      deletedAt={service.deleted_at}
                      isActive={service.is_active}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline">
                        <Link href={`/account/services/${service.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      {service.deleted_at ? (
                        <form action={restoreServiceAction}>
                          <input name="id" type="hidden" value={service.id} />
                          <Button type="submit" variant="outline">
                            Restore
                          </Button>
                        </form>
                      ) : (
                        <>
                          <form action={setServiceActiveAction}>
                            <input name="id" type="hidden" value={service.id} />
                            <input
                              name="is_active"
                              type="hidden"
                              value={service.is_active ? "false" : "true"}
                            />
                            <Button type="submit" variant="outline">
                              {service.is_active ? "Deactivate" : "Activate"}
                            </Button>
                          </form>
                          <form action={softDeleteServiceAction}>
                            <input name="id" type="hidden" value={service.id} />
                            <Button type="submit" variant="outline">
                              Delete
                            </Button>
                          </form>
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
                  colSpan={8}
                >
                  No services match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ResponsiveTable>

      <Pagination
        pageParam="s_page"
        pagination={result.pagination}
        searchParams={urlSearchParams}
      />
    </section>
  );
}

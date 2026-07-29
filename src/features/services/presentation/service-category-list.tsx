import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  restoreServiceCategoryAction,
  setServiceCategoryActiveAction,
  softDeleteServiceCategoryAction,
} from "@/features/services/actions/service-category.actions";
import { ManagementControls } from "@/features/services/presentation/service-management-controls";
import { Pagination } from "@/features/services/presentation/pagination";
import { StatusBadge } from "@/features/services/presentation/status-badge";
import type {
  CategoryListFilters,
  PaginatedResult,
  ServiceCategoryRow,
  ServiceManagementSearchParams,
} from "@/features/services/types/service-management.types";

interface ServiceCategoryListProps {
  readonly filters: CategoryListFilters;
  readonly result: PaginatedResult<ServiceCategoryRow>;
  readonly searchParams: ServiceManagementSearchParams;
}

const categorySortOptions = [
  { label: "Display order", value: "display_order" },
  { label: "Name", value: "name" },
  { label: "Status", value: "is_active" },
  { label: "Created", value: "created_at" },
  { label: "Updated", value: "updated_at" },
] as const;

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

export function ServiceCategoryList({
  filters,
  result,
  searchParams,
}: ServiceCategoryListProps) {
  const urlSearchParams = toUrlSearchParams(searchParams);

  return (
    <section className="grid gap-5" id="categories">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold">
            Service categories
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Organize services into ordered groups.
          </p>
        </div>
        <Button asChild>
          <Link href="/account/services/categories/new">New category</Link>
        </Button>
      </div>

      <ManagementControls
        active={filters.active}
        deleted={filters.deleted}
        direction={filters.direction}
        pageName="Category"
        prefix="c"
        search={filters.search}
        sort={filters.sort}
        sortOptions={categorySortOptions}
      />

      <div className="border-border overflow-x-auto border">
        <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.data.length ? (
              result.data.map((category) => (
                <tr className="border-border border-t" key={category.id}>
                  <td className="px-4 py-4 font-medium">{category.name}</td>
                  <td className="text-muted-foreground px-4 py-4">
                    {category.slug}
                  </td>
                  <td className="px-4 py-4">{category.display_order}</td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      deletedAt={category.deleted_at}
                      isActive={category.is_active}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="default" variant="outline">
                        <Link
                          href={`/account/services/categories/${category.id}/edit`}
                        >
                          Edit
                        </Link>
                      </Button>
                      {category.deleted_at ? (
                        <form action={restoreServiceCategoryAction}>
                          <input name="id" type="hidden" value={category.id} />
                          <Button type="submit" variant="outline">
                            Restore
                          </Button>
                        </form>
                      ) : (
                        <>
                          <form action={setServiceCategoryActiveAction}>
                            <input
                              name="id"
                              type="hidden"
                              value={category.id}
                            />
                            <input
                              name="is_active"
                              type="hidden"
                              value={category.is_active ? "false" : "true"}
                            />
                            <Button type="submit" variant="outline">
                              {category.is_active ? "Deactivate" : "Activate"}
                            </Button>
                          </form>
                          <form action={softDeleteServiceCategoryAction}>
                            <input
                              name="id"
                              type="hidden"
                              value={category.id}
                            />
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
                  colSpan={5}
                >
                  No service categories match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        pageParam="c_page"
        pagination={result.pagination}
        searchParams={urlSearchParams}
      />
    </section>
  );
}

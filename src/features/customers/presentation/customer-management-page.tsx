import { UserButton } from "@clerk/nextjs";
import { Contact } from "lucide-react";

import { APP_NAME } from "@/constants/app";
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
    <main className="bg-background text-foreground min-h-dvh">
      <div className="mx-auto grid min-h-dvh w-full max-w-7xl gap-10 px-6 py-8 sm:px-10 lg:px-12">
        <header className="border-border flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-4">
            <span className="border-border bg-card grid size-11 place-items-center border">
              <Contact aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-muted-foreground text-sm">{APP_NAME}</p>
              <h1 className="mt-2 font-serif text-4xl font-semibold">
                Customer management
              </h1>
            </div>
          </div>
          <UserButton />
        </header>

        <CustomerList
          filters={filters}
          result={result}
          searchParams={searchParams}
        />
      </div>
    </main>
  );
}

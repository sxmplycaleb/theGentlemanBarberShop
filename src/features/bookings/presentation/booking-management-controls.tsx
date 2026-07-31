import type {
  BookingListFilters,
  BookingSelectionOptions,
} from "@/features/bookings/types/booking-management.types";

const statusOptions = [
  ["all", "All statuses"],
  ["pending", "Pending"],
  ["confirmed", "Confirmed"],
  ["completed", "Completed"],
  ["cancelled", "Cancelled"],
  ["no_show", "No show"],
] as const;

const sortOptions = [
  ["booking_date", "Booking date"],
  ["start_time", "Start time"],
  ["status", "Status"],
  ["created_at", "Created"],
  ["updated_at", "Updated"],
] as const;

interface BookingManagementControlsProps {
  readonly filters: BookingListFilters;
  readonly options: BookingSelectionOptions;
}

export function BookingManagementControls({
  filters,
  options,
}: BookingManagementControlsProps) {
  return (
    <form className="border-border bg-card grid gap-4 rounded-lg border p-4 shadow-sm md:grid-cols-2 xl:grid-cols-5">
      <input name="page" type="hidden" value="1" />
      <label className="grid gap-2 text-sm md:col-span-2">
        <span className="text-muted-foreground">Booking search</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={filters.search}
          name="search"
          placeholder="Search customer, staff, service, or booking ID"
          type="search"
        />
      </label>
      <FilterSelect
        defaultValue={filters.status}
        label="Status"
        name="status"
        options={statusOptions.map(([value, label]) => ({ label, value }))}
      />
      <FilterSelect
        defaultValue={filters.customerId}
        label="Customer"
        name="customer"
        options={[
          { label: "All customers", value: "" },
          ...options.customers.map((option) => ({
            label: option.full_name,
            value: option.id,
          })),
        ]}
      />
      <FilterSelect
        defaultValue={filters.staffId}
        label="Staff"
        name="staff"
        options={[
          { label: "All staff", value: "" },
          ...options.staff.map((option) => ({
            label: option.display_name,
            value: option.id,
          })),
        ]}
      />
      <FilterSelect
        defaultValue={filters.serviceId}
        label="Service"
        name="service"
        options={[
          { label: "All services", value: "" },
          ...options.services.map((option) => ({
            label: option.name,
            value: option.id,
          })),
        ]}
      />
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Date from</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={filters.dateFrom}
          name="date_from"
          type="date"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Date to</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={filters.dateTo}
          name="date_to"
          type="date"
        />
      </label>
      <FilterSelect
        defaultValue={filters.deleted}
        label="Records"
        name="deleted"
        options={[
          { label: "Current", value: "not-deleted" },
          { label: "Deleted", value: "deleted" },
          { label: "All records", value: "all" },
        ]}
      />
      <FilterSelect
        defaultValue={filters.sort}
        label="Sort"
        name="sort"
        options={sortOptions.map(([value, label]) => ({ label, value }))}
      />
      <FilterSelect
        defaultValue={filters.direction}
        label="Direction"
        name="direction"
        options={[
          { label: "Ascending", value: "asc" },
          { label: "Descending", value: "desc" },
        ]}
      />
      <button
        className="bg-primary text-primary-foreground hover:bg-primary/90 min-h-11 rounded-sm px-4 text-sm font-semibold shadow-xs xl:col-start-5"
        type="submit"
      >
        Apply
      </button>
    </form>
  );
}

function FilterSelect({
  defaultValue,
  label,
  name,
  options,
}: {
  readonly defaultValue: string;
  readonly label: string;
  readonly name: string;
  readonly options: readonly {
    readonly label: string;
    readonly value: string;
  }[];
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select
        className="border-border bg-background min-h-11 rounded-sm border px-3"
        defaultValue={defaultValue}
        name={name}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

import Link from "next/link";

import { Button } from "@/components/ui/button";
import type {
  BookingWorkflowFilters,
  BookingWorkflowOptions,
} from "@/features/appointments/types/booking-workflow.types";
import { BOOKING_STATUSES } from "@/features/bookings/types/booking-management.types";

export function AppointmentWorkflowControls({
  filters,
  options,
}: {
  readonly filters: BookingWorkflowFilters;
  readonly options: BookingWorkflowOptions;
}) {
  return (
    <form className="border-border bg-card grid gap-4 rounded-lg border p-4 shadow-sm md:grid-cols-2 xl:grid-cols-6">
      <input name="page" type="hidden" value="1" />
      <label className="grid gap-2 text-sm xl:col-span-2">
        <span className="text-muted-foreground">Search</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={filters.search}
          name="search"
          placeholder="Customer, staff, service, or booking ID"
          type="search"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Date</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={filters.bookingDate}
          name="date"
          type="date"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Staff</span>
        <select
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={filters.staffId}
          name="staff"
        >
          <option value="">All staff</option>
          {options.staff.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.display_name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Status</span>
        <select
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={filters.status}
          name="status"
        >
          <option value="all">All statuses</option>
          {BOOKING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status === "no_show" ? "No show" : status}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Sort</span>
        <select
          className="border-border bg-background min-h-11 rounded-sm border px-3"
          defaultValue={filters.sort}
          name="sort"
        >
          <option value="start_time">Start time</option>
          <option value="status">Status</option>
        </select>
      </label>
      <div className="flex items-end gap-2 xl:col-span-6">
        <Button type="submit">Apply filters</Button>
        <Button asChild variant="outline">
          <Link href="/account/appointments">Reset</Link>
        </Button>
      </div>
    </form>
  );
}

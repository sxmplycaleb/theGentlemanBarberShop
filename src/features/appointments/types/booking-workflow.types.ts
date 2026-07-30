import type { PaginationMeta } from "@/components/management/pagination";
import type {
  BookingStaff,
  BookingStatus,
  BookingWithRelations,
} from "@/features/bookings/types/booking-management.types";

export type BookingWorkflowProjection = BookingWithRelations & {
  readonly availableTransitions: readonly BookingStatus[];
};

export type BookingWorkflowFilters = {
  readonly bookingDate: string;
  readonly direction: "asc" | "desc";
  readonly page: number;
  readonly pageSize: number;
  readonly search: string;
  readonly sort: "start_time" | "status";
  readonly staffId: string;
  readonly status: BookingStatus | "all";
};

export type BookingWorkflowSearchParams = {
  readonly date?: string | readonly string[];
  readonly direction?: string | readonly string[];
  readonly page?: string | readonly string[];
  readonly search?: string | readonly string[];
  readonly sort?: string | readonly string[];
  readonly staff?: string | readonly string[];
  readonly status?: string | readonly string[];
};

export type BookingWorkflowResult = {
  readonly data: readonly BookingWorkflowProjection[];
  readonly pagination: PaginationMeta;
};

export type BookingWorkflowOptions = {
  readonly staff: readonly BookingStaff[];
};

export type BookingWorkflowActionState = {
  readonly message?: string;
  readonly success: boolean;
};

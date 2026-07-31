import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { BookingWorkflowList } from "@/features/appointments/presentation/booking-workflow-list";
import type {
  BookingWorkflowFilters,
  BookingWorkflowOptions,
  BookingWorkflowResult,
  BookingWorkflowSearchParams,
} from "@/features/appointments/types/booking-workflow.types";

export function AppointmentWorkflowPage(props: {
  readonly businessDate: string;
  readonly filters: BookingWorkflowFilters;
  readonly options: BookingWorkflowOptions;
  readonly result: BookingWorkflowResult;
  readonly searchParams: BookingWorkflowSearchParams;
}) {
  return (
    <AuthenticatedPageShell
      description={`Manage today's operational queue. Business date: ${props.businessDate}.`}
      title="Appointment workflow"
    >
      <BookingWorkflowList {...props} />
    </AuthenticatedPageShell>
  );
}

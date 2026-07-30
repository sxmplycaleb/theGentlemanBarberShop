import { UserButton } from "@clerk/nextjs";
import { CalendarCheck } from "lucide-react";

import { APP_NAME } from "@/constants/app";
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
    <main className="bg-background text-foreground min-h-dvh">
      <div className="mx-auto grid min-h-dvh w-full max-w-7xl gap-10 px-6 py-8 sm:px-10 lg:px-12">
        <header className="border-border flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-4">
            <span className="border-border bg-card grid size-11 place-items-center border">
              <CalendarCheck aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-muted-foreground text-sm">{APP_NAME}</p>
              <h1 className="mt-2 font-serif text-4xl font-semibold">
                Appointment workflow
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Business date: {props.businessDate}
              </p>
            </div>
          </div>
          <UserButton />
        </header>
        <BookingWorkflowList {...props} />
      </div>
    </main>
  );
}

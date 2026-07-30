import { auth } from "@clerk/nextjs/server";

import { createBookingAction } from "@/features/bookings/actions/booking.actions";
import { listBookingSelectionOptions } from "@/features/bookings/data/booking.repository";
import { BookingForm } from "@/features/bookings/presentation/booking-form";
import { BookingFormPage } from "@/features/bookings/presentation/booking-form-page";

export default async function Page() {
  await auth.protect();
  const options = await listBookingSelectionOptions();

  return (
    <BookingFormPage title="New booking">
      <BookingForm
        action={createBookingAction}
        options={options}
        submitLabel="Create booking"
      />
    </BookingFormPage>
  );
}

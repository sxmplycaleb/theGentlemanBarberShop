import { auth } from "@clerk/nextjs/server";

import { createStaffAction } from "@/features/staff/actions/staff.actions";
import { StaffForm } from "@/features/staff/presentation/staff-form";
import { StaffFormPage } from "@/features/staff/presentation/staff-form-page";

export default async function Page() {
  await auth.protect();

  return (
    <StaffFormPage title="New staff member">
      <StaffForm action={createStaffAction} submitLabel="Create staff member" />
    </StaffFormPage>
  );
}

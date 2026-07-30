import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { updateStaffAction } from "@/features/staff/actions/staff.actions";
import { getStaffById } from "@/features/staff/data/staff.repository";
import { StaffForm } from "@/features/staff/presentation/staff-form";
import { StaffFormPage } from "@/features/staff/presentation/staff-form-page";
import { staffIdSchema } from "@/features/staff/validation/staff.schema";

interface PageProps {
  readonly params: Promise<{
    readonly staffId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  await auth.protect();

  const { staffId } = await params;
  const parsed = staffIdSchema.safeParse({ id: staffId });

  if (!parsed.success) {
    notFound();
  }

  const staff = await getStaffById(parsed.data.id);

  return (
    <StaffFormPage title="Edit staff member">
      <StaffForm
        action={updateStaffAction.bind(null, staff.id)}
        staff={staff}
        submitLabel="Update staff member"
      />
    </StaffFormPage>
  );
}

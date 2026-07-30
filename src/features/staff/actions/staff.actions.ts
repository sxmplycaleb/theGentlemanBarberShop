"use server";

import {
  createStaff,
  restoreStaff,
  setStaffActive,
  softDeleteStaff,
  updateStaff,
} from "@/features/staff/data/staff.repository";
import {
  staffFormSchema,
  staffIdSchema,
} from "@/features/staff/validation/staff.schema";
import type { ActionState } from "@/features/staff/types/staff-management.types";
import {
  actionFailure,
  actionSuccess,
  formDataToObject,
  protectStaffManagementAction,
  revalidateStaffManagementPaths,
  zodErrorsToActionState,
} from "@/features/staff/actions/action-utils";

export async function createStaffAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await protectStaffManagementAction();

  const parsed = staffFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return zodErrorsToActionState(parsed.error);
  }

  try {
    await createStaff(parsed.data);
    revalidateStaffManagementPaths();
    return actionSuccess("Staff member created.");
  } catch (error) {
    return actionFailure(
      error instanceof Error ? error.message : "Staff member was not created.",
    );
  }
}

export async function updateStaffAction(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await protectStaffManagementAction();

  const idResult = staffIdSchema.safeParse({ id });
  const valuesResult = staffFormSchema.safeParse(formDataToObject(formData));

  if (!idResult.success) {
    return actionFailure("Invalid staff member.");
  }

  if (!valuesResult.success) {
    return zodErrorsToActionState(valuesResult.error);
  }

  try {
    await updateStaff(idResult.data.id, valuesResult.data);
    revalidateStaffManagementPaths();
    return actionSuccess("Staff member updated.");
  } catch (error) {
    return actionFailure(
      error instanceof Error ? error.message : "Staff member was not updated.",
    );
  }
}

export async function softDeleteStaffAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await protectStaffManagementAction();

  const parsed = staffIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return actionFailure("Invalid staff member.");
  }

  try {
    await softDeleteStaff(parsed.data.id);
    revalidateStaffManagementPaths();
    return actionSuccess("Staff member deleted.");
  } catch (error) {
    return actionFailure(
      error instanceof Error ? error.message : "Staff member was not deleted.",
    );
  }
}

export async function restoreStaffAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await protectStaffManagementAction();

  const parsed = staffIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return actionFailure("Invalid staff member.");
  }

  try {
    await restoreStaff(parsed.data.id);
    revalidateStaffManagementPaths();
    return actionSuccess("Staff member restored.");
  } catch (error) {
    return actionFailure(
      error instanceof Error ? error.message : "Staff member was not restored.",
    );
  }
}

export async function setStaffActiveAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await protectStaffManagementAction();

  const parsed = staffIdSchema
    .extend({
      is_active: staffFormSchema.shape.is_active,
    })
    .safeParse({
      id: formData.get("id"),
      is_active: formData.get("is_active"),
    });

  if (!parsed.success) {
    return actionFailure("Invalid staff member status.");
  }

  try {
    await setStaffActive(parsed.data.id, parsed.data.is_active);
    revalidateStaffManagementPaths();
    return actionSuccess(
      parsed.data.is_active
        ? "Staff member activated."
        : "Staff member deactivated.",
    );
  } catch (error) {
    return actionFailure(
      error instanceof Error
        ? error.message
        : "Staff member status was not updated.",
    );
  }
}

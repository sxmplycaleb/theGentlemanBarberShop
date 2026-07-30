"use server";

import {
  createService,
  restoreService,
  setServiceActive,
  softDeleteService,
  updateService,
} from "@/features/services/data/service.repository";
import {
  serviceFormSchema,
  serviceIdSchema,
} from "@/features/services/validation/service.schema";
import type { ActionState } from "@/features/services/types/service-management.types";
import {
  actionFailure,
  actionSuccess,
  formDataToObject,
  protectServiceManagementAction,
  revalidateServiceManagementPaths,
  zodErrorsToActionState,
} from "@/features/services/actions/action-utils";

export async function createServiceAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await protectServiceManagementAction();

  const parsed = serviceFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return zodErrorsToActionState(parsed.error);
  }

  try {
    await createService(parsed.data);
    revalidateServiceManagementPaths();
    return actionSuccess("Service created.");
  } catch (error) {
    return actionFailure(
      error instanceof Error ? error.message : "Service was not created.",
    );
  }
}

export async function updateServiceAction(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await protectServiceManagementAction();

  const idResult = serviceIdSchema.safeParse({ id });
  const valuesResult = serviceFormSchema.safeParse(formDataToObject(formData));

  if (!idResult.success) {
    return actionFailure("Invalid service.");
  }

  if (!valuesResult.success) {
    return zodErrorsToActionState(valuesResult.error);
  }

  try {
    await updateService(idResult.data.id, valuesResult.data);
    revalidateServiceManagementPaths();
    return actionSuccess("Service updated.");
  } catch (error) {
    return actionFailure(
      error instanceof Error ? error.message : "Service was not updated.",
    );
  }
}

export async function softDeleteServiceAction(
  formData: FormData,
): Promise<void> {
  await protectServiceManagementAction();

  const parsed = serviceIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    throw new Error("Invalid service.");
  }

  await softDeleteService(parsed.data.id);
  revalidateServiceManagementPaths();
}

export async function restoreServiceAction(formData: FormData): Promise<void> {
  await protectServiceManagementAction();

  const parsed = serviceIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    throw new Error("Invalid service.");
  }

  await restoreService(parsed.data.id);
  revalidateServiceManagementPaths();
}

export async function setServiceActiveAction(
  formData: FormData,
): Promise<void> {
  await protectServiceManagementAction();

  const parsed = serviceIdSchema
    .extend({
      is_active: serviceFormSchema.shape.is_active,
    })
    .safeParse({
      id: formData.get("id"),
      is_active: formData.get("is_active"),
    });

  if (!parsed.success) {
    throw new Error("Invalid service status.");
  }

  await setServiceActive(parsed.data.id, parsed.data.is_active);
  revalidateServiceManagementPaths();
}

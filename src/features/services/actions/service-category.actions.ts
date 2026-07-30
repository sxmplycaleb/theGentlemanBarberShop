"use server";

import {
  createServiceCategory,
  restoreServiceCategory,
  setServiceCategoryActive,
  softDeleteServiceCategory,
  updateServiceCategory,
} from "@/features/services/data/service-category.repository";
import {
  serviceCategoryFormSchema,
  serviceCategoryIdSchema,
} from "@/features/services/validation/service-category.schema";
import type { ActionState } from "@/features/services/types/service-management.types";
import {
  actionFailure,
  actionSuccess,
  formDataToObject,
  protectServiceManagementAction,
  revalidateServiceManagementPaths,
  zodErrorsToActionState,
} from "@/features/services/actions/action-utils";

export async function createServiceCategoryAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await protectServiceManagementAction();

  const parsed = serviceCategoryFormSchema.safeParse(
    formDataToObject(formData),
  );

  if (!parsed.success) {
    return zodErrorsToActionState(parsed.error);
  }

  try {
    await createServiceCategory(parsed.data);
    revalidateServiceManagementPaths();
    return actionSuccess("Service category created.");
  } catch (error) {
    return actionFailure(
      error instanceof Error
        ? error.message
        : "Service category was not created.",
    );
  }
}

export async function updateServiceCategoryAction(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await protectServiceManagementAction();

  const idResult = serviceCategoryIdSchema.safeParse({ id });
  const valuesResult = serviceCategoryFormSchema.safeParse(
    formDataToObject(formData),
  );

  if (!idResult.success) {
    return actionFailure("Invalid service category.");
  }

  if (!valuesResult.success) {
    return zodErrorsToActionState(valuesResult.error);
  }

  try {
    await updateServiceCategory(idResult.data.id, valuesResult.data);
    revalidateServiceManagementPaths();
    return actionSuccess("Service category updated.");
  } catch (error) {
    return actionFailure(
      error instanceof Error
        ? error.message
        : "Service category was not updated.",
    );
  }
}

export async function softDeleteServiceCategoryAction(
  formData: FormData,
): Promise<void> {
  await protectServiceManagementAction();

  const parsed = serviceCategoryIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    throw new Error("Invalid service category.");
  }

  await softDeleteServiceCategory(parsed.data.id);
  revalidateServiceManagementPaths();
}

export async function restoreServiceCategoryAction(
  formData: FormData,
): Promise<void> {
  await protectServiceManagementAction();

  const parsed = serviceCategoryIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    throw new Error("Invalid service category.");
  }

  await restoreServiceCategory(parsed.data.id);
  revalidateServiceManagementPaths();
}

export async function setServiceCategoryActiveAction(
  formData: FormData,
): Promise<void> {
  await protectServiceManagementAction();

  const parsed = serviceCategoryIdSchema
    .extend({
      is_active: serviceCategoryFormSchema.shape.is_active,
    })
    .safeParse({
      id: formData.get("id"),
      is_active: formData.get("is_active"),
    });

  if (!parsed.success) {
    throw new Error("Invalid service category status.");
  }

  await setServiceCategoryActive(parsed.data.id, parsed.data.is_active);
  revalidateServiceManagementPaths();
}

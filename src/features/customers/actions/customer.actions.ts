"use server";

import { auth } from "@clerk/nextjs/server";

import {
  actionFailure,
  actionSuccess,
  formDataToObject,
  revalidateCustomerManagementPaths,
  zodErrorsToActionState,
} from "@/features/customers/actions/action-utils";
import {
  createCustomer,
  restoreCustomer,
  setCustomerActive,
  softDeleteCustomer,
  updateCustomer,
} from "@/features/customers/data/customer.repository";
import type { ActionState } from "@/features/customers/types/customer-management.types";
import {
  customerFormSchema,
  customerIdSchema,
  customerStatusSchema,
} from "@/features/customers/validation/customer.schema";

export async function createCustomerAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await auth.protect();

  const parsed = customerFormSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return zodErrorsToActionState(parsed.error);
  }

  try {
    await createCustomer(parsed.data);
    revalidateCustomerManagementPaths();
    return actionSuccess("Customer created.");
  } catch {
    return actionFailure("Customer could not be created. Please try again.");
  }
}

export async function updateCustomerAction(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await auth.protect();

  const idResult = customerIdSchema.safeParse({ id });
  const valuesResult = customerFormSchema.safeParse(formDataToObject(formData));

  if (!idResult.success) {
    return actionFailure("Invalid customer.");
  }

  if (!valuesResult.success) {
    return zodErrorsToActionState(valuesResult.error);
  }

  try {
    await updateCustomer(idResult.data.id, valuesResult.data);
    revalidateCustomerManagementPaths();
    return actionSuccess("Customer updated.");
  } catch {
    return actionFailure("Customer could not be updated. Please try again.");
  }
}

export async function softDeleteCustomerAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await auth.protect();

  const parsed = customerIdSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return actionFailure("Invalid customer.");
  }

  try {
    await softDeleteCustomer(parsed.data.id);
    revalidateCustomerManagementPaths();
    return actionSuccess("Customer deleted.");
  } catch {
    return actionFailure("Customer could not be deleted. Please try again.");
  }
}

export async function restoreCustomerAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await auth.protect();

  const parsed = customerIdSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return actionFailure("Invalid customer.");
  }

  try {
    await restoreCustomer(parsed.data.id);
    revalidateCustomerManagementPaths();
    return actionSuccess("Customer restored.");
  } catch {
    return actionFailure("Customer could not be restored. Please try again.");
  }
}

export async function setCustomerActiveAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await auth.protect();

  const parsed = customerStatusSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return actionFailure("Invalid customer status.");
  }

  try {
    await setCustomerActive(parsed.data.id, parsed.data.is_active);
    revalidateCustomerManagementPaths();
    return actionSuccess(
      parsed.data.is_active ? "Customer activated." : "Customer deactivated.",
    );
  } catch {
    return actionFailure(
      "Customer status could not be updated. Please try again.",
    );
  }
}

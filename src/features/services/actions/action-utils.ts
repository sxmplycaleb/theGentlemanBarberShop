import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import type { ActionState } from "@/features/services/types/service-management.types";

export const actionSuccess = (message: string): ActionState => ({
  message,
  success: true,
});

export const actionFailure = (
  message: string,
  errors?: Record<string, readonly string[]>,
): ActionState => {
  if (errors) {
    return {
      errors,
      message,
      success: false,
    };
  }

  return {
    message,
    success: false,
  };
};

export async function protectServiceManagementAction() {
  await auth.protect();
}

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export function zodErrorsToActionState(error: ZodError): ActionState {
  return actionFailure(
    "Check the highlighted fields.",
    error.flatten().fieldErrors,
  );
}

export function revalidateServiceManagementPaths() {
  revalidatePath("/account");
  revalidatePath("/account/services");
}

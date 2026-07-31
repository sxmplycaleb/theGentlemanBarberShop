import { Alert } from "@/components/ui/alert";

function ActionFeedback({
  message,
  success,
}: {
  readonly message: string | undefined;
  readonly success: boolean;
}) {
  if (!message) {
    return null;
  }

  return (
    <Alert
      aria-live={success ? "polite" : undefined}
      role={success ? "status" : "alert"}
      variant={success ? "success" : "danger"}
    >
      {message}
    </Alert>
  );
}

export { ActionFeedback };

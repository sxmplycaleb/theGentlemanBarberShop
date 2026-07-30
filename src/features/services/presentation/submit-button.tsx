"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  readonly children: React.ReactNode;
}

export function SubmitButton({ children }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? "Saving" : children}
    </Button>
  );
}

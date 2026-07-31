"use client";

import { TriangleAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

function ConfirmationDialog({
  confirmLabel,
  description,
  title,
  triggerLabel,
}: {
  readonly confirmLabel: string;
  readonly description: string;
  readonly title: string;
  readonly triggerLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    confirmRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  const confirm = () => {
    const form = triggerRef.current?.closest("form");
    setOpen(false);
    form?.requestSubmit();
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
        variant="outline"
      >
        {triggerLabel}
      </Button>
      {open ? (
        <div
          aria-labelledby="confirmation-title"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center p-4"
          role="dialog"
        >
          <button
            aria-label="Close confirmation"
            className="bg-foreground/45 absolute inset-0 backdrop-blur-xs"
            onClick={() => setOpen(false)}
            type="button"
          />
          <section className="border-border bg-popover text-popover-foreground relative z-10 w-full max-w-md rounded-lg border p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <span className="bg-danger/12 text-danger grid size-10 shrink-0 place-items-center rounded-full">
                <TriangleAlert aria-hidden="true" className="size-5" />
              </span>
              <Button
                aria-label="Close confirmation"
                onClick={() => setOpen(false)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <X aria-hidden="true" className="size-4" />
              </Button>
            </div>
            <h2 className="mt-5 text-xl font-semibold" id="confirmation-title">
              {title}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              {description}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={confirm}
                ref={confirmRef}
                type="button"
                variant="danger"
              >
                {confirmLabel}
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

export { ConfirmationDialog };

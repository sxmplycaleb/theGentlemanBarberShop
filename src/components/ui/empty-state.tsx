import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

function EmptyState({
  action,
  className,
  description,
  title,
}: {
  readonly action?: React.ReactNode;
  readonly className?: string;
  readonly description: string;
  readonly title: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-muted/30 flex flex-col items-center rounded-lg border border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      <span className="border-border bg-card grid size-12 place-items-center rounded-full border shadow-xs">
        <Inbox aria-hidden="true" className="text-muted-foreground size-5" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export { EmptyState };

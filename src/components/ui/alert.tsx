import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";

type AlertVariant = "danger" | "info" | "neutral" | "success" | "warning";

const styles: Record<AlertVariant, string> = {
  danger: "border-danger/30 bg-danger/10 text-foreground",
  info: "border-info/30 bg-info/10 text-foreground",
  neutral: "border-border bg-muted/60 text-foreground",
  success: "border-success/30 bg-success/10 text-foreground",
  warning: "border-warning/35 bg-warning/10 text-foreground",
};

const icons = {
  danger: CircleX,
  info: Info,
  neutral: CircleAlert,
  success: CircleCheck,
  warning: TriangleAlert,
};

function Alert({
  children,
  className,
  title,
  variant = "neutral",
  ...props
}: React.ComponentProps<"div"> & {
  readonly title?: string;
  readonly variant?: AlertVariant;
}) {
  const Icon = icons[variant];

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] gap-3 rounded-md border p-4 text-sm shadow-xs",
        styles[variant],
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4" />
      <div className="min-w-0">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={cn("leading-6", title ? "mt-1" : "")}>{children}</div>
      </div>
    </div>
  );
}

export { Alert };

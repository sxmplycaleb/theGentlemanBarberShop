import { cn } from "@/lib/utils";

function ResponsiveTable({
  children,
  className,
  label = "Scrollable data table",
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly label?: string;
}) {
  return (
    <div
      aria-label={label}
      className={cn(
        "border-border bg-card max-w-full overflow-x-auto rounded-lg border shadow-sm",
        className,
      )}
      role="region"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

export { ResponsiveTable };

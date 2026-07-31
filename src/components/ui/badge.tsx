import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted text-foreground",
        success:
          "border-success/25 bg-success/12 text-success dark:bg-success/15",
        warning:
          "border-warning/30 bg-warning/15 text-warning-foreground dark:text-warning",
        danger: "border-danger/25 bg-danger/12 text-danger dark:bg-danger/15",
        info: "border-info/25 bg-info/12 text-info dark:bg-info/15",
        outline: "border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

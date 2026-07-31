import { cn } from "@/lib/utils";

function FormField({
  children,
  className,
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return <div className={cn("grid gap-2 text-sm", className)}>{children}</div>;
}

function FormLabel({
  className,
  required,
  ...props
}: React.ComponentProps<"label"> & { readonly required?: boolean }) {
  return (
    <label className={cn("font-semibold", className)} {...props}>
      {props.children}
      {required ? (
        <>
          <span aria-hidden="true" className="text-danger">
            {" "}
            *
          </span>
          <span className="sr-only"> required</span>
        </>
      ) : null}
    </label>
  );
}

function FormHelp({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground text-xs leading-5", className)}
      {...props}
    />
  );
}

function FormError({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-danger text-sm font-medium", className)}
      {...props}
    />
  );
}

export { FormError, FormField, FormHelp, FormLabel };

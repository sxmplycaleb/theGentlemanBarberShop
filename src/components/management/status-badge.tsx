interface StatusBadgeProps {
  readonly deletedAt: string | null;
  readonly isActive: boolean;
}

export function StatusBadge({ deletedAt, isActive }: StatusBadgeProps) {
  if (deletedAt) {
    return (
      <span className="border-border text-muted-foreground inline-flex min-h-7 items-center rounded-sm border px-2 text-xs">
        Deleted
      </span>
    );
  }

  return (
    <span className="border-border inline-flex min-h-7 items-center rounded-sm border px-2 text-xs">
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

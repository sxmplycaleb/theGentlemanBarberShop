interface StatusBadgeProps {
  readonly deletedAt: string | null;
  readonly isActive: boolean;
}

export function StatusBadge({ deletedAt, isActive }: StatusBadgeProps) {
  if (deletedAt) {
    return <Badge variant="outline">Deleted</Badge>;
  }

  return (
    <Badge variant={isActive ? "success" : "warning"}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}
import { Badge } from "@/components/ui/badge";

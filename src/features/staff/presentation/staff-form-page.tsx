import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { Card, CardContent } from "@/components/ui/card";

interface StaffFormPageProps {
  readonly children: React.ReactNode;
  readonly title: string;
}

export function StaffFormPage({ children, title }: StaffFormPageProps) {
  return (
    <AuthenticatedPageShell
      description="Manage the team profile shown throughout the application."
      title={title}
    >
      <Card className="max-w-3xl">
        <CardContent>{children}</CardContent>
      </Card>
    </AuthenticatedPageShell>
  );
}

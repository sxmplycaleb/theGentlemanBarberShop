import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceFormPageProps {
  readonly children: React.ReactNode;
  readonly title: string;
}

export function ServiceFormPage({ children, title }: ServiceFormPageProps) {
  return (
    <AuthenticatedPageShell
      description="Update presentation and availability while preserving service rules."
      title={title}
    >
      <Card className="max-w-3xl">
        <CardContent>{children}</CardContent>
      </Card>
    </AuthenticatedPageShell>
  );
}

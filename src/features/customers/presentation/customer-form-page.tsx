import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { Card, CardContent } from "@/components/ui/card";

interface CustomerFormPageProps {
  readonly children: React.ReactNode;
  readonly title: string;
}

export function CustomerFormPage({ children, title }: CustomerFormPageProps) {
  return (
    <AuthenticatedPageShell
      description="Keep customer contact details accurate and easy to find."
      title={title}
    >
      <Card className="max-w-3xl">
        <CardContent>{children}</CardContent>
      </Card>
    </AuthenticatedPageShell>
  );
}

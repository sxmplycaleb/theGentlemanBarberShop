import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { Card, CardContent } from "@/components/ui/card";

interface BookingFormPageProps {
  readonly children: React.ReactNode;
  readonly title: string;
}

export function BookingFormPage({ children, title }: BookingFormPageProps) {
  return (
    <AuthenticatedPageShell
      description="Select a customer, team member, service, date, and time."
      title={title}
    >
      <Card className="max-w-4xl">
        <CardContent>{children}</CardContent>
      </Card>
    </AuthenticatedPageShell>
  );
}

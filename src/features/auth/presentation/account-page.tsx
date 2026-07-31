import {
  CalendarCheck,
  CalendarDays,
  Contact,
  CreditCard,
  Scissors,
  Settings2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { AuthenticatedPageShell } from "@/components/layout/authenticated-page-shell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";

interface AccountPageProps {
  readonly userId: string;
}

const modules = [
  {
    description: "Manage checkout, payment history, receipts, and refunds.",
    href: "/account/payments",
    icon: CreditCard,
    label: "Payments",
  },
  {
    description: "Run the daily queue and permitted lifecycle transitions.",
    href: "/account/appointments",
    icon: CalendarCheck,
    label: "Appointments",
  },
  {
    description: "Create, schedule, update, and restore customer bookings.",
    href: "/account/bookings",
    icon: CalendarDays,
    label: "Bookings",
  },
  {
    description: "Organize categories, services, duration, and pricing.",
    href: "/account/services",
    icon: Scissors,
    label: "Services",
  },
  {
    description: "Maintain team member profiles and availability status.",
    href: "/account/staff",
    icon: UsersRound,
    label: "Staff",
  },
  {
    description: "Keep customer profiles and contact details up to date.",
    href: "/account/customers",
    icon: Contact,
    label: "Customers",
  },
  {
    description: "Configure the business name, timezone, and currency.",
    href: "/account/settings",
    icon: Settings2,
    label: "Business settings",
  },
] as const;

export function AccountPage({ userId }: AccountPageProps) {
  return (
    <AuthenticatedPageShell
      actions={
        <Button asChild>
          <Link href="/account/bookings/new">Create booking</Link>
        </Button>
      }
      description="A focused operational home for bookings, appointments, customers, and payments."
      title="Dashboard"
    >
      <Alert title="Signed in" variant="success">
        Clerk is managing the active session for this browser.
        <span className="sr-only"> Session user: {userId}</span>
      </Alert>

      <section aria-labelledby="quick-actions-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              className="font-serif text-2xl font-semibold"
              id="quick-actions-heading"
            >
              Quick actions
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Jump straight into the most common daily tasks.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild className="justify-start" variant="secondary">
            <Link href="/account/bookings/new">
              <CalendarDays aria-hidden="true" className="size-4" />
              New booking
            </Link>
          </Button>
          <Button asChild className="justify-start" variant="outline">
            <Link href="/account/bookings">
              <CreditCard aria-hidden="true" className="size-4" />
              Checkout
            </Link>
          </Button>
          <Button asChild className="justify-start" variant="outline">
            <Link href="/account/customers">
              <Contact aria-hidden="true" className="size-4" />
              Customers
            </Link>
          </Button>
          <Button asChild className="justify-start" variant="outline">
            <Link href="/account/settings">
              <Settings2 aria-hidden="true" className="size-4" />
              Settings
            </Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="operations-heading">
        <div>
          <h2
            className="font-serif text-2xl font-semibold"
            id="operations-heading"
          >
            Business operations
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Open a workspace without inventing analytics or unavailable totals.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <MetricCard
                description={module.description}
                href={module.href}
                icon={<Icon aria-hidden="true" className="size-5" />}
                key={module.href}
                label={module.label}
              />
            );
          })}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="text-success size-5" />
            Secure operations
          </CardTitle>
          <CardDescription>
            Authentication, permissions, workflow rules, and financial
            protections remain unchanged.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground text-sm leading-6">
            Use the profile menu in the top navigation to manage the active
            Clerk session.
          </p>
        </CardContent>
      </Card>
    </AuthenticatedPageShell>
  );
}

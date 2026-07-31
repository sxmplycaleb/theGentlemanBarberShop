"use client";

import { UserButton } from "@clerk/nextjs";
import {
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Contact,
  CreditCard,
  LayoutDashboard,
  Menu,
  Plus,
  Scissors,
  Settings2,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { APP_NAME } from "@/constants/app";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/account", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/account/appointments", icon: CalendarCheck, label: "Appointments" },
  { href: "/account/bookings", icon: CalendarDays, label: "Bookings" },
  { href: "/account/customers", icon: Contact, label: "Customers" },
  { href: "/account/services", icon: Scissors, label: "Services" },
  { href: "/account/staff", icon: UsersRound, label: "Staff" },
  { href: "/account/payments", icon: CreditCard, label: "Payments" },
  { href: "/account/settings", icon: Settings2, label: "Business settings" },
] as const;

const segmentLabels: Record<string, string> = {
  account: "Dashboard",
  appointments: "Appointments",
  bookings: "Bookings",
  categories: "Categories",
  checkout: "Checkout",
  customers: "Customers",
  edit: "Edit",
  new: "New",
  payments: "Payments",
  services: "Services",
  settings: "Business settings",
  staff: "Staff",
};

function isActivePath(pathname: string, href: string) {
  return href === "/account"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function Breadcrumbs({ pathname }: { readonly pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isIdentifier =
      !segmentLabels[segment] && index > 1 && segment !== segments.at(-1);
    const label =
      segmentLabels[segment] ??
      (isIdentifier || /^[0-9a-f-]{20,}$/i.test(segment)
        ? "Details"
        : "Details");

    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-muted-foreground flex min-w-0 items-center gap-2 text-xs">
        {crumbs.map((crumb, index) => (
          <li className="flex min-w-0 items-center gap-2" key={crumb.href}>
            {index ? (
              <ChevronRight aria-hidden="true" className="size-3 shrink-0" />
            ) : null}
            {index === crumbs.length - 1 ? (
              <span
                aria-current="page"
                className="text-foreground truncate font-medium"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                className="hover:text-foreground truncate"
                href={crumb.href}
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function NavigationLinks({
  collapsed,
  onNavigate,
  pathname,
}: {
  readonly collapsed: boolean;
  readonly onNavigate?: () => void;
  readonly pathname: string;
}) {
  return (
    <nav aria-label="Primary navigation" className="grid gap-1">
      {navigation.map((item) => {
        const active = isActivePath(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed ? "justify-center px-0" : "",
            )}
            href={item.href}
            key={item.href}
            {...(onNavigate ? { onClick: onNavigate } : {})}
            {...(collapsed ? { title: item.label } : {})}
          >
            <Icon aria-hidden="true" className="size-5 shrink-0" />
            {collapsed ? (
              <span className="sr-only">{item.label}</span>
            ) : (
              item.label
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand({ collapsed }: { readonly collapsed: boolean }) {
  return (
    <Link
      className={cn(
        "flex min-h-12 items-center gap-3 rounded-md",
        collapsed ? "justify-center" : "",
      )}
      href="/account"
    >
      <span className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-md shadow-sm">
        <Scissors aria-hidden="true" className="size-5" />
      </span>
      {collapsed ? null : (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">
            The Gentleman
          </span>
          <span className="text-muted-foreground block text-xs">
            BarberShop &amp; Spa
          </span>
        </span>
      )}
    </Link>
  );
}

function AuthenticatedPageShell({
  actions,
  children,
  description,
  title,
}: {
  readonly actions?: React.ReactNode;
  readonly children: React.ReactNode;
  readonly description?: string;
  readonly title: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  return (
    <div className="bg-background text-foreground min-h-dvh">
      <aside
        className={cn(
          "border-border bg-card fixed inset-y-0 left-0 z-30 hidden border-r p-4 shadow-sm transition-[width] lg:flex lg:flex-col",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <Brand collapsed={collapsed} />
        <div className="mt-8 flex-1">
          <NavigationLinks collapsed={collapsed} pathname={pathname} />
        </div>
        <Button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-full"
          onClick={() => setCollapsed((value) => !value)}
          size={collapsed ? "icon" : "default"}
          type="button"
          variant="ghost"
        >
          {collapsed ? (
            <ChevronRight aria-hidden="true" className="size-4" />
          ) : (
            <>
              <ChevronLeft aria-hidden="true" className="size-4" />
              Collapse
            </>
          )}
        </Button>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="bg-foreground/45 absolute inset-0 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
            type="button"
          />
          <aside
            aria-label="Mobile navigation"
            className="border-border bg-card relative flex h-full w-[min(20rem,88vw)] flex-col border-r p-5 shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <Brand collapsed={false} />
              <Button
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <X aria-hidden="true" className="size-5" />
              </Button>
            </div>
            <div className="mt-8 flex-1 overflow-y-auto">
              <NavigationLinks
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
                pathname={pathname}
              />
            </div>
          </aside>
        </div>
      ) : null}

      <div
        className={cn(
          "min-w-0 transition-[padding-left]",
          collapsed ? "lg:pl-20" : "lg:pl-64",
        )}
      >
        <header className="border-border bg-background/92 sticky top-0 z-20 border-b backdrop-blur-xl">
          <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Button
              aria-label="Open navigation"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <Menu aria-hidden="true" className="size-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <Breadcrumbs pathname={pathname} />
            </div>
            <Button asChild className="hidden sm:inline-flex" size="sm">
              <Link href="/account/bookings/new">
                <Plus aria-hidden="true" className="size-4" />
                New booking
              </Link>
            </Button>
            <ThemeToggle />
            <div aria-label="User profile" className="grid place-items-center">
              <UserButton />
            </div>
          </div>
        </header>

        <main className="min-w-0">
          <div className="mx-auto grid w-full max-w-[96rem] gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
                  {APP_NAME}
                </p>
                <h1 className="mt-2 font-serif text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                  {title}
                </h1>
                {description ? (
                  <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6 sm:text-base">
                    {description}
                  </p>
                ) : null}
              </div>
              {actions ? (
                <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
              ) : null}
            </header>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export { AuthenticatedPageShell };

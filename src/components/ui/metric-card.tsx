import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

function MetricCard({
  description,
  href,
  icon,
  label,
  value,
}: {
  readonly description: string;
  readonly href: string;
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value?: string;
}) {
  return (
    <Card className="group hover:border-input relative transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <span className="bg-secondary text-secondary-foreground grid size-11 place-items-center rounded-md">
            {icon}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
        <p className="mt-5 text-sm font-semibold">{label}</p>
        {value ? (
          <p className="mt-2 font-serif text-3xl font-semibold">{value}</p>
        ) : null}
        <p className="text-muted-foreground mt-2 flex-1 text-sm leading-6">
          {description}
        </p>
        <Link
          aria-label={`Open ${label}`}
          className="text-primary mt-4 text-sm font-semibold after:absolute after:inset-0"
          href={href}
        >
          Open<span className="sr-only"> {label}</span>
        </Link>
      </CardContent>
    </Card>
  );
}

export { MetricCard };

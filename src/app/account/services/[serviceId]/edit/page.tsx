import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { updateServiceAction } from "@/features/services/actions/service.actions";
import { listAvailableServiceCategories } from "@/features/services/data/service-category.repository";
import { getServiceById } from "@/features/services/data/service.repository";
import { ServiceForm } from "@/features/services/presentation/service-form";
import { ServiceFormPage } from "@/features/services/presentation/service-form-page";
import { serviceIdSchema } from "@/features/services/validation/service.schema";

interface PageProps {
  readonly params: Promise<{
    readonly serviceId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  await auth.protect();

  const { serviceId } = await params;
  const parsed = serviceIdSchema.safeParse({ id: serviceId });

  if (!parsed.success) {
    notFound();
  }

  const [categories, service] = await Promise.all([
    listAvailableServiceCategories(),
    getServiceById(parsed.data.id),
  ]);

  return (
    <ServiceFormPage title="Edit service">
      <ServiceForm
        action={updateServiceAction.bind(null, service.id)}
        categories={categories}
        service={service}
        submitLabel="Update service"
      />
    </ServiceFormPage>
  );
}

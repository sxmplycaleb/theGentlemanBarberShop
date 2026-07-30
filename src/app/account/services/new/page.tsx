import { auth } from "@clerk/nextjs/server";

import { createServiceAction } from "@/features/services/actions/service.actions";
import { listAvailableServiceCategories } from "@/features/services/data/service-category.repository";
import { ServiceForm } from "@/features/services/presentation/service-form";
import { ServiceFormPage } from "@/features/services/presentation/service-form-page";

export default async function Page() {
  await auth.protect();

  const categories = await listAvailableServiceCategories();

  return (
    <ServiceFormPage title="New service">
      <ServiceForm
        action={createServiceAction}
        categories={categories}
        submitLabel="Create service"
      />
    </ServiceFormPage>
  );
}

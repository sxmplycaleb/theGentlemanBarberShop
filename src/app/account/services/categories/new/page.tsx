import { auth } from "@clerk/nextjs/server";

import { createServiceCategoryAction } from "@/features/services/actions/service-category.actions";
import { ServiceCategoryForm } from "@/features/services/presentation/service-category-form";
import { ServiceFormPage } from "@/features/services/presentation/service-form-page";

export default async function Page() {
  await auth.protect();

  return (
    <ServiceFormPage title="New category">
      <ServiceCategoryForm
        action={createServiceCategoryAction}
        submitLabel="Create category"
      />
    </ServiceFormPage>
  );
}

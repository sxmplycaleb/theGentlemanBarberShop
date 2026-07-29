import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { updateServiceCategoryAction } from "@/features/services/actions/service-category.actions";
import { getServiceCategoryById } from "@/features/services/data/service-category.repository";
import { ServiceCategoryForm } from "@/features/services/presentation/service-category-form";
import { ServiceFormPage } from "@/features/services/presentation/service-form-page";
import { serviceCategoryIdSchema } from "@/features/services/validation/service-category.schema";

interface PageProps {
  readonly params: Promise<{
    readonly categoryId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  await auth.protect();

  const { categoryId } = await params;
  const parsed = serviceCategoryIdSchema.safeParse({ id: categoryId });

  if (!parsed.success) {
    notFound();
  }

  const category = await getServiceCategoryById(parsed.data.id);

  return (
    <ServiceFormPage title="Edit category">
      <ServiceCategoryForm
        action={updateServiceCategoryAction.bind(null, category.id)}
        category={category}
        submitLabel="Update category"
      />
    </ServiceFormPage>
  );
}

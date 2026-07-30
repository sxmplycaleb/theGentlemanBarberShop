import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { updateCustomerAction } from "@/features/customers/actions/customer.actions";
import { getCustomerById } from "@/features/customers/data/customer.repository";
import { CustomerForm } from "@/features/customers/presentation/customer-form";
import { CustomerFormPage } from "@/features/customers/presentation/customer-form-page";
import { customerIdSchema } from "@/features/customers/validation/customer.schema";

interface PageProps {
  readonly params: Promise<{
    readonly customerId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  await auth.protect();

  const { customerId } = await params;
  const parsed = customerIdSchema.safeParse({ id: customerId });

  if (!parsed.success) {
    notFound();
  }

  const customer = await getCustomerById(parsed.data.id);

  if (!customer || customer.deleted_at) {
    notFound();
  }

  return (
    <CustomerFormPage title="Edit customer">
      <CustomerForm
        action={updateCustomerAction.bind(null, customer.id)}
        customer={{
          email: customer.email,
          full_name: customer.full_name,
          is_active: customer.is_active,
          notes: customer.notes,
          phone_number: customer.phone_number,
        }}
        submitLabel="Update customer"
      />
    </CustomerFormPage>
  );
}

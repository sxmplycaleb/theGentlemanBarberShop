import { auth } from "@clerk/nextjs/server";

import { createCustomerAction } from "@/features/customers/actions/customer.actions";
import { CustomerForm } from "@/features/customers/presentation/customer-form";
import { CustomerFormPage } from "@/features/customers/presentation/customer-form-page";

export default async function Page() {
  await auth.protect();

  return (
    <CustomerFormPage title="New customer">
      <CustomerForm
        action={createCustomerAction}
        submitLabel="Create customer"
      />
    </CustomerFormPage>
  );
}

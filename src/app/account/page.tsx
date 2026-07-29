import { auth } from "@clerk/nextjs/server";

import { AccountPage } from "@/features/auth/presentation/account-page";

export default async function Page() {
  const { userId } = await auth.protect();

  return <AccountPage userId={userId} />;
}

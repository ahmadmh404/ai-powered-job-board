import React, { Suspense } from "react";

import { OrganizationList } from "@clerk/nextjs";

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

export default function OrganizationSelectPage(props: Props) {
  return (
    <Suspense>
      <SuspendedPage {...props} />
    </Suspense>
  );
}

async function SuspendedPage({ searchParams }: Props) {
  const { redirect } = await searchParams;

  const redirectUrl = redirect ?? "/employer";

  return (
    <OrganizationList
      afterCreateOrganizationUrl={redirectUrl}
      afterSelectOrganizationUrl={redirectUrl}
      hideSlug
      hidePersonal
      skipInvitationScreen
    />
  );
}

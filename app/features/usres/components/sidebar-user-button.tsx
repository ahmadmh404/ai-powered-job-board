import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { SidebarUserButtonClient } from "./_sidebar-user-button-client";

export function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
}

async function SidebarUserSuspense() {
  const { userId } = await auth();

  const user = {
    email: "ahmadhossamo789@gmail.com",
    name: "Ahmad Hossamo",
    imageUrl: "",
  };

  return <SidebarUserButtonClient user={user} />;
}

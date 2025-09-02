import { Suspense } from "react";
import {
  getCurrentOrganaization,
  getCurrentUser,
} from "@/app/services/clerk/components/lib/get-current-auth";
import { SignOutButton } from "@/app/services/clerk/components/auth-buttons";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import SidebarOrganaizationClientButton from "./_sidebar-organaizatoin-button-client";
import { LogOutIcon } from "lucide-react";

export function SidebarOrganaizationButton() {
  return (
    <Suspense>
      <SidebarOrganaizationSuspense />
    </Suspense>
  );
}

async function SidebarOrganaizationSuspense() {
  const [{ user }, { organaization }] = await Promise.all([
    getCurrentUser({ allData: true }),
    getCurrentOrganaization({ allData: true }),
  ]);

  if (user == null || organaization == null) {
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon />
          <span>Log Out</span>
        </SidebarMenuButton>
      </SignOutButton>
    );
  }

  return (
    <SidebarOrganaizationClientButton
      user={user}
      organaization={organaization}
    />
  );
}

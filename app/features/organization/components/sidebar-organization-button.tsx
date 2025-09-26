import { Suspense } from "react";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/app/services/clerk/lib/get-current-auth";
import { SignOutButton } from "@/app/services/clerk/components/auth-buttons";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import SidebarOrganaizationClientButton from "./_sidebar-organization-button-client";

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
    getCurrentOrganization({ allData: true }),
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

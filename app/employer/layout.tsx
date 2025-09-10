import { Suspense } from "react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import SidebarNavMenuGroup, {
  Item,
} from "@/components/shared/sidebar-nav-menu-group";

import { ClipboardListIcon, PlusIcon } from "lucide-react";
import { getCurrentOrganaization } from "../services/clerk/components/lib/get-current-auth";
import { redirect } from "next/navigation";
import { ChildrenProps } from "@/types";
import { SidebarOrganaizationButton } from "../features/organization/components/sidebar-organization-button";

const navItems: Item[] = [
  { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },
];

const Content = (
  <>
    <SidebarGroup>
      <SidebarGroupLabel>Job LIstings</SidebarGroupLabel>
      <SidebarGroupAction title="Add Job Listing" asChild>
        <Link href={"/employer/job-listing/new"}>
          <PlusIcon /> <span className="sr-only">Add Job Listing</span>
        </Link>
      </SidebarGroupAction>
    </SidebarGroup>

    <SidebarNavMenuGroup className="mt-auto" items={navItems} />
  </>
);

const footerButton = <SidebarOrganaizationButton />;

export default function EmployerLayout({ children }: ChildrenProps) {
  return (
    <Suspense>
      <SuspenseLayout>{children}</SuspenseLayout>
    </Suspense>
  );
}

async function SuspenseLayout({ children }: ChildrenProps) {
  const { orgId } = await getCurrentOrganaization();

  if (orgId == null) return redirect("/organaizations/select");

  return (
    <AppSidebar content={Content} footerButton={footerButton}>
      {children}
    </AppSidebar>
  );
}

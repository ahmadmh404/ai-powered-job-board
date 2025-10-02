import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarUserButton } from "../features/usres/components/sidebar-user-button";

import SidebarNavMenuGroup, {
  Item,
} from "@/components/shared/sidebar-nav-menu-group";

import { BrainCircuitIcon, LayoutDashboardIcon, LogInIcon } from "lucide-react";
import { ReactNode } from "react";

const navItems: Item[] = [
  { href: "/ai-search", icon: <BrainCircuitIcon />, label: "AI Search" },
  {
    href: "/employer",
    icon: <LayoutDashboardIcon />,
    label: "Employer Dashboard",
    authStatus: "signed-in",
  },
  {
    href: "/sign-in",
    icon: <LogInIcon />,
    label: "Sign In",
    authStatus: "signed-out",
  },
];

const footerButton = <SidebarUserButton />;

const JobSeekerLayout = ({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) => {
  return (
    <AppSidebar
      content={
        <>
          {sidebar}
          <SidebarNavMenuGroup className="mt-auto" items={navItems} />
        </>
      }
      footerButton={footerButton}
    >
      <main className="flex-1">{children}</main>
    </AppSidebar>
  );
};

export default JobSeekerLayout;

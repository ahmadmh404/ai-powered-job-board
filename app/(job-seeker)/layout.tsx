import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarUserButton } from "../features/usres/components/sidebar-user-button";

import SidebarNavMenuGroup, {
  Item,
} from "@/components/shared/sidebar-nav-menu-group";

import {
  BrainCircuitIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  LogInIcon,
} from "lucide-react";

const navItems: Item[] = [
  { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },
  { href: "/ai-search", icon: <BrainCircuitIcon />, label: "AI Search" },
  {
    href: "/employer",
    icon: <LayoutDashboardIcon />,
    label: "Employer Dashbaord",
    authStatus: "signed-in",
  },
  {
    href: "/sign-in",
    icon: <LogInIcon />,
    label: "Sign In",
    authStatus: "signed-out",
  },
];

const Content = <SidebarNavMenuGroup className="mt-auto" items={navItems} />;

const footerButton = <SidebarUserButton />;

const JobSeekerLayout = () => {
  return (
    <AppSidebar content={Content} footerButton={footerButton}>
      <main className="flex-1">lahgoehrgo</main>
    </AppSidebar>
  );
};

export default JobSeekerLayout;

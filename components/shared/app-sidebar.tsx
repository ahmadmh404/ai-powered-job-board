import { ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebarClient } from "@/components/shared/_app-sidebar-client";
import { SignedIn } from "@/services/clerk/components/sign-in-status";
import Link from "next/link";

type Props = {
  children: ReactNode;
  content: ReactNode;
  footerButton: ReactNode;
};

export function AppSidebar({ children, content, footerButton }: Props) {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar className="overflow-hidden" collapsible="icon">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <Link href={"/"} className="text-nowrap text-xl">
              SPN Jobs
            </Link>
          </SidebarHeader>

          {/* Implemnt later */}
          <SidebarContent>{content}</SidebarContent>

          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>{footerButton}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>

        <main className="flex-1">{children}</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
}

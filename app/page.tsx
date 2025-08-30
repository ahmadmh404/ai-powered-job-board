import Link from "next/link";
import { AppSidebarClient } from "./_app-sidebar-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogInIcon } from "lucide-react";
import {
  SignedIn,
  SignedOut,
} from "./services/clerk/components/sign-in-status";
import { SidebarUserButton } from "./features/usres/components/sidebar-user-button";

const HomePage = () => {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar className="overflow-hidden" collapsible="icon">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="text-nowrap text-xl">SPN Jobs</span>
          </SidebarHeader>

          {/* Implemnt later */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SignedOut>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={"/sign-in"}>
                        <LogInIcon />
                        <span>Log in</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SignedOut>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarUserButton />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>

        <main className="flex-1">lahgoehrgo</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
};

export default HomePage;

"use client";

import {
  SignedIn,
  SignedOut,
} from "@/app/services/clerk/components/sign-in-status";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export type Item = {
  href: string;
  label: string;
  icon: ReactNode;
  authStatus?: "signed-in" | "signed-out";
};

type Props = {
  items: Item[];
  className?: string;
};

export default function SidebarNavMenuGroup({ items, className = "" }: Props) {
  const pathname = usePathname();

  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        {items.map((item, key) => {
          const html = (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );

          if (item.authStatus === "signed-out") {
            return <SignedOut key={key}>{html}</SignedOut>;
          }

          if (item.authStatus === "signed-in") {
            return <SignedIn key={key}>{html}</SignedIn>;
          }

          return html;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

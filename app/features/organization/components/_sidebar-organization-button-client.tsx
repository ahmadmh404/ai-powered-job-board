"use client";

import React from "react";

import { Organization, User } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeftRightIcon,
  Building2,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOut,
  UserRoundCogIcon,
} from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@/app/services/clerk/components/auth-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useClerk } from "@clerk/nextjs";

type Props = {
  user: User;
  organization: Organization;
};

export function SidebarOrganizationClientButton({ user, organization }: Props) {
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  const { openOrganizationProfile } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size={"lg"}
          className="data-[state=open]:bg-sidebar-accent data-[state=open[:text-sidebar-accent-foreground"
        >
          <OrganizationInfo user={user} organization={organization} />
          <ChevronsUpDownIcon className="ml-auto group-data-[state=collapsed]:hidden" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={4}
        align="end"
        side={isMobile ? "bottom" : "right"}
        className="min-w-64 max-w-80"
      >
        <OrganizationInfo user={user} organization={organization} />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            openOrganizationProfile();
            setOpenMobile(false);
          }}
        >
          <Building2 className="mr-1" /> Manage organization
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={"/employer/user-settings"}>
            <UserRoundCogIcon className="mr-1" /> User Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={"/employer/pricing"}>
            <CreditCardIcon className="mr-1" /> Change plan
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={"/organization/select"}>
            <ArrowLeftRightIcon className="mr-1" /> Switch Organization
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <SignOutButton>
          <DropdownMenuItem>
            <LogOut className="mr-1" /> Log out
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function OrganizationInfo({ user, organization }: Props) {
  const nameInitials = organization.name
    .split(" ")
    .splice(0, 2)
    .map((str) => str.charAt(0))
    .join("");

  return (
    <div className="flex items-center gap-2 p-2">
      <Avatar className="rounded-lg size-8">
        <AvatarImage
          src={organization.imageUrl ?? undefined}
          alt={organization.name}
        />
        <AvatarFallback className="uppercase bg-primary text-primary-foreground">
          {nameInitials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="truncate text-sm font-semibold">
          {organization.name}
        </span>
        <span className="truncate text-sm xs">{user.email}</span>
      </div>
    </div>
  );
}

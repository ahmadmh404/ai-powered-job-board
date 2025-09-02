import React from "react";

import { Organaization, User } from "@/types";
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
  Settings,
  UserIcon,
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
  organaization: Organaization;
};

function SidebarOrganaizationClientButton({ user, organaization }: Props) {
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
          <OrganaizationInfo user={user} organaization={organaization} />
          <ChevronsUpDownIcon className="ml-auto group-data-[state=collapsed]:hidden" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={4}
        align="end"
        side={isMobile ? "bottom" : "right"}
        className="min-w-64 max-w-80"
      >
        <OrganaizationInfo user={user} organaization={organaization} />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            openOrganizationProfile();
            setOpenMobile(false);
          }}
        >
          <Building2 className="mr-1" /> Manage organaization
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
          <Link href={"/organaizations/select"}>
            <ArrowLeftRightIcon className="mr-1" /> Switch Organaization
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

export function OrganaizationInfo({ user, organaization }: Props) {
  const nameInitials = organaization.name
    .split(" ")
    .splice(0, 2)
    .map((str) => str.charAt(0))
    .join("");

  return (
    <div className="flex items-center gap-2 p-2">
      <Avatar className="rounded-lg size-8">
        <AvatarImage
          src={organaization.imageUrl ?? undefined}
          alt={organaization.name}
        />
        <AvatarFallback className="uppercase bg-primary text-primary-foreground">
          {nameInitials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="truncate text-sm font-semibold">
          {organaization.name}
        </span>
        <span className="truncate text-sm xs">{user.email}</span>
      </div>
    </div>
  );
}

export default SidebarOrganaizationClientButton;

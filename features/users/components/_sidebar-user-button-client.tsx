"use client";

import Link from "next/link";
import { SignOutButton } from "@/services/clerk/components/auth-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { UserTable } from "@/drizzle/schemas";
import { useIsMobile } from "@/hooks/use-mobile";
import { useClerk } from "@clerk/nextjs";
import { ChevronsUpDownIcon, LogOut, Settings, UserIcon } from "lucide-react";

type Props = {
  user: typeof UserTable.$inferInsert;
};

export function SidebarUserButtonClient({ user }: Props) {
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  const { openUserProfile } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size={"lg"}
          className="data-[state=open]:bg-sidebar-accent data-[state=open[:text-sidebar-accent-foreground"
        >
          <UserInfo user={user} />
          <ChevronsUpDownIcon className="ml-auto group-data-[state=collapsed]:hidden" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={4}
        align="end"
        side={isMobile ? "bottom" : "right"}
        className="min-w-64 max-w-80"
      >
        <UserInfo user={user} />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            openUserProfile();
            setOpenMobile(false);
          }}
        >
          <UserIcon className="mr-1" /> Profile
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={"/user-settings/notifications"}>
            <Settings className="mr-1" /> Settings
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

export function UserInfo({ user }: Props) {
  const { email, name, imageUrl } = user;

  const nameInitials = name
    .split(" ")
    .splice(0, 2)
    .map((str) => str.charAt(0))
    .join("");

  return (
    <div className="flex items-center gap-2 p-2">
      <Avatar className="rounded-lg size-8">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback className="uppercase bg-primary text-primary-foreground">
          {nameInitials}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col flex-1 min-w-0 leading-tight group-data-[state=collapsed]:hidden">
        <span className="truncate text-sm font-semibold">{name}</span>
        <span className="truncate text-sm xs">{email}</span>
      </div>
    </div>
  );
}

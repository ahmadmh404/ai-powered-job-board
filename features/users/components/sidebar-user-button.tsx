import { Suspense } from "react";
import { SidebarUserButtonClient } from "./_sidebar-user-button-client";
import { SignOutButton } from "@/services/clerk/components/auth-buttons";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import { getCurrentUser } from "@/services/clerk/lib/get-current-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SidebarUserButton() {
  return (
    <Suspense fallback={<SidebarUserButtonSkeleton />}>
      <SidebarUserSuspense />
    </Suspense>
  );
}

async function SidebarUserSuspense() {
  const { user } = await getCurrentUser({ allData: true });

  if (user == null) {
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon />
          Log Out
        </SidebarMenuButton>
      </SignOutButton>
    );
  }

  return <SidebarUserButtonClient user={user} />;
}

export function SidebarUserButtonSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <SidebarMenuButton
      size="lg"
      disabled
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <div className="flex items-center gap-2 p-2 w-full min-w-0">
        {/* Matches Avatar (`rounded-lg size-8`) */}
        <Skeleton className="size-8 rounded-lg shrink-0" />

        {/* Matches name & email stack */}
        <div className="flex flex-col flex-1 min-w-0 gap-1.5 leading-tight group-data-[state=collapsed]:hidden">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>

        {/* Matches ChevronsUpDownIcon (`ml-auto group-data-[state=collapsed]:hidden`) */}
        <Skeleton className="size-4 rounded-sm shrink-0 ml-auto group-data-[state=collapsed]:hidden" />
      </div>
    </SidebarMenuButton>
  );
}

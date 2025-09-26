import { Suspense } from "react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import SidebarNavMenuGroup, {
  Item,
} from "@/components/shared/sidebar-nav-menu-group";

import { ClipboardListIcon, PlusIcon } from "lucide-react";
import { getCurrentOrganization } from "../services/clerk/lib/get-current-auth";
import { redirect } from "next/navigation";
import { ChildrenProps } from "@/types";
import { SidebarOrganaizationButton } from "../features/organization/components/sidebar-organization-button";
import { hasOrgUserPermission } from "../services/clerk/lib/org-user-permissions";
import AsyncIf from "@/components/async-if";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobListingOrganizationTag } from "../features/job-listings/db/cache/job-listings";
import { db } from "@/drizzle/db";
import {
  JobLIstingApplicationTable,
  JobListingStatus,
  JobListingTable,
} from "@/drizzle/schema";
import { count, desc, eq } from "drizzle-orm";
import { getJobListingApplicationJobListingTag } from "../features/job-listing-applications/db/cache/job-listing-applications";
import { sortJobListingsByStatus } from "../features/job-listings/lib/utils";
import JobLIstingMenuGroup from "./_job-listings-menu-group";

const navItems: Item[] = [
  { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },
];

export default function EmployerLayout({ children }: ChildrenProps) {
  return (
    <Suspense>
      <SuspenseLayout>{children}</SuspenseLayout>
    </Suspense>
  );
}

async function SuspenseLayout({ children }: ChildrenProps) {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null) return redirect("/organaizations/select");

  return (
    <AppSidebar
      content={
        <>
          <SidebarGroup>
            <SidebarGroupLabel>Job LIstings</SidebarGroupLabel>
            <AsyncIf
              condition={() => hasOrgUserPermission("job_listing:create")}
            >
              <SidebarGroupAction title="Add Job Listing" asChild>
                <Link href={"/employer/job-listing/new"}>
                  <PlusIcon /> <span className="sr-only">Add Job Listing</span>
                </Link>
              </SidebarGroupAction>
            </AsyncIf>

            <SidebarGroupContent className="group-data-[state=collapsed]:hidden">
              <Suspense>
                <JobListingMenu orgId={orgId} />
              </Suspense>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarNavMenuGroup className="mt-auto" items={navItems} />
        </>
      }
      footerButton={<SidebarOrganaizationButton />}
    >
      {children}
    </AppSidebar>
  );
}

async function JobListingMenu({ orgId }: { orgId: string }) {
  const jobListings = await getJobListings(orgId);

  if (
    jobListings.length === 0 &&
    (await hasOrgUserPermission("job_listing:create"))
  ) {
    return (
      <SidebarMenu>
        <SidebarMenuButton asChild>
          <Link href={"/employer/job-listing/new"}>
            <PlusIcon />
            <span>Create you first Job Listing</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenu>
    );
  }

  return Object.entries(Object.groupBy(jobListings, (j) => j.status))
    .sort(([a], [b]) => {
      return sortJobListingsByStatus(
        a as JobListingStatus,
        b as JobListingStatus
      );
    })
    .map(([status, jobListings]) => (
      <JobLIstingMenuGroup
        key={status}
        status={status as JobListingStatus}
        jobListings={jobListings}
      />
    ));
}

async function getJobListings(orgId: string) {
  "use cache";

  cacheTag(getJobListingOrganizationTag(orgId));

  const data = await db
    .select({
      id: JobListingTable.id,
      title: JobListingTable.title,
      status: JobListingTable.status,
      applicationCount: count(JobLIstingApplicationTable.userId),
    })
    .from(JobListingTable)
    .leftJoin(
      JobLIstingApplicationTable,
      eq(JobListingTable.id, JobLIstingApplicationTable.jobListingId)
    )
    .groupBy(JobLIstingApplicationTable.jobListingId, JobListingTable.id)
    .orderBy(desc(JobListingTable.createdAt));

  data.forEach((jobListing) => {
    cacheTag(getJobListingApplicationJobListingTag(jobListing.id));
  });

  return data;
}

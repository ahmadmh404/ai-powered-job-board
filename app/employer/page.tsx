import React, { Suspense } from "react";
import { getCurrentOrganaization } from "../services/clerk/components/lib/get-current-auth";
import { db } from "@/drizzle/db";
import { desc, eq } from "drizzle-orm";
import { JobListingTable, OrganizationTable } from "@/drizzle/schema";
import { redirect } from "next/navigation";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobListingOrganizationTag } from "../features/job-listings/db/cache/job-listings";

function EmployerHomePage() {
  return (
    <Suspense>
      <SuspensedPage />
    </Suspense>
  );
}

async function SuspensedPage() {
  const { orgId } = await getCurrentOrganaization();

  if (!orgId) return null;

  const jobListing = await getMostRecentJobListing(orgId);

  if (jobListing == null) {
    redirect("/employer/job-listing/new");
  } else {
    redirect(`/employer/job-listing/${jobListing.id}`);
  }
}

async function getMostRecentJobListing(orgId: string) {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));

  return db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.organizationId, orgId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  });
}

export default EmployerHomePage;

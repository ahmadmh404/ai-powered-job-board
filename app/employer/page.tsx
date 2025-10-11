import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schemas";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentOrganization } from "@/services/clerk/lib/get-current-auth";
import { getJobListingOrganizationTag } from "../features/job-listings/db/cache/job-listings";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default function EmployerHomePage() {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  const { orgId } = await getCurrentOrganization();
  if (orgId == null) return null;

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

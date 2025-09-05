import React, { Suspense } from "react";
import { getCurrentOrganaization } from "../services/clerk/components/lib/get-current-auth";
import { db } from "@/drizzle/db";
import { desc, eq } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";
import { redirect } from "next/navigation";

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
    redirect("/empolyer/job-listing/new");
  } else {
    redirect(`/empolyer/job-listing/${jobListing.id}`);
  }
}

async function getMostRecentJobListing(orgId: string) {
  return await db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.id, orgId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  });
}

export default EmployerHomePage;

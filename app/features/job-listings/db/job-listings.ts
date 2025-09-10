import { JobListingTable } from "@/drizzle/schema";
import { revalidateJobListingCache } from "./cache/job-listings";
import { db } from "@/drizzle/db";

export async function insertJobListing(
  jobListing: typeof JobListingTable.$inferInsert
) {
  const [newListing] = await db
    .insert(JobListingTable)
    .values(jobListing)
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingCache({
    jobListingId: newListing.id,
    organizationId: newListing.organizationId,
  });

  return newListing;
}

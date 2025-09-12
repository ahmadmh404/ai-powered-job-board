import { JobListingTable } from "@/drizzle/schema";
import { revalidateJobListingCache } from "./cache/job-listings";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

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

export async function updateJobListing(
  id: string,
  jobListing: Partial<typeof JobListingTable.$inferInsert>
) {
  const [updatedJobListing] = await db
    .update(JobListingTable)
    .set(jobListing)
    .where(eq(JobListingTable.id, id))
    .returning({
      jobListingId: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingCache(updatedJobListing);

  return updatedJobListing;
}

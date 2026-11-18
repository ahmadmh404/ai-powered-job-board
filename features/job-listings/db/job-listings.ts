"use server";

import { JobListingTable } from "@/drizzle/schemas";
import {
  getJobListingGlobalTag,
  revalidateJobListingCache,
} from "./cache/job-listings";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import z from "zod";
import { jobListingAISearchSchema } from "../actions/schemas";
import { getCurrentUser } from "@/services/clerk/lib/get-current-auth";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getMatchingJobListing } from "@/services/inngest/ai/get-matching-job-listings";

export async function insertJobListing(
  jobListing: typeof JobListingTable.$inferInsert,
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
  jobListing: Partial<typeof JobListingTable.$inferInsert>,
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

export async function deleteJobListing(id: string) {
  const [deletedJobListing] = await db
    .delete(JobListingTable)
    .where(eq(JobListingTable.id, id))
    .returning({
      jobListingId: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingCache(deletedJobListing);

  return deletedJobListing;
}

export const getJobListingAISearchResults = async (
  unsafe: z.infer<typeof jobListingAISearchSchema>,
): Promise<
  { error: true; message: string } | { error: false; jobIds: string[] }
> => {
  const { userId } = await getCurrentUser();

  if (userId == null) {
    return {
      error: true,
      message: "You need to have an account to use AI search",
    };
  }

  const { success, data } = jobListingAISearchSchema.safeParse(unsafe);

  if (!success) {
    return {
      error: true,
      message: "There was an error processing your search query",
    };
  }

  const allListings = await getPublicJobListings();

  const matchedJobListings = await getMatchingJobListing({
    jobListings: allListings,
    prompt: data.query,
    options: { maxNumberOfJobs: 10 },
  });

  if (matchedJobListings.length === 0) {
    return {
      error: true,
      message: "No jobs matched your criteria",
    };
  }

  return { error: false, jobIds: matchedJobListings };
};

async function getPublicJobListings() {
  "use cache";
  cacheTag(getJobListingGlobalTag());

  return db.query.JobListingTable.findMany({
    where: eq(JobListingTable.status, "published"),
  });
}

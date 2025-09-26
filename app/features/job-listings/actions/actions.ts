"use server";

import z from "zod";
import { JobListingSchema } from "./schemas";
import { getCurrentOrganization } from "@/app/services/clerk/lib/get-current-auth";
import { redirect } from "next/navigation";
import {
  insertJobListing,
  updateJobListing as updateJobListingDB,
  deleteJobListing as deleteJobListingDB,
} from "../db/job-listings";
import { JobListingTable } from "@/drizzle/schema";
import { getJobListing } from "@/app/employer/job-listing/[jobListingId]/page";
import { hasOrgUserPermission } from "@/app/services/clerk/lib/org-user-permissions";
import { getNextJobListingStatus } from "../lib/utils";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "../lib/plan-features-helpers";

export async function createJobListing(
  unsaveData: z.infer<typeof JobListingSchema>
) {
  const { orgId } = await getCurrentOrganization();

  const hasPermission = await hasOrgUserPermission("job_listing:create");

  if (orgId == null || !hasPermission) {
    return {
      error: true,
      message: "You have no permission to create a job listing",
    };
  }

  const { success, data } = JobListingSchema.safeParse(unsaveData);

  if (!success) {
    return {
      error: true,
      message: "THere was an error creating your job listing",
    };
  }

  const jobListing = await insertJobListing({
    ...data,
    organizationId: orgId,
    status: "draft",
  });

  redirect(`/employer/job-listing/${jobListing.id}`);
}

export async function updateJobListing(
  id: string,
  unsaveData: Partial<typeof JobListingTable.$inferInsert>
) {
  const { orgId } = await getCurrentOrganization();

  const hasPermission = await hasOrgUserPermission("job_listing:update");

  if (orgId == null || !hasPermission) {
    return {
      error: true,
      message: "You have no permission to update a job listing",
    };
  }

  const { success, data } = JobListingSchema.safeParse(unsaveData);

  if (!success) {
    return {
      error: true,
      message: "THere was an error updating your job listing",
    };
  }

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) {
    return {
      error: true,
      message: "THere was an error updating your job listing",
    };
  }

  const updatedJobListing = updateJobListingDB(id, data);

  redirect(`/employer/job-listing/${(await updatedJobListing).jobListingId}`);
}

export async function toggleJobListingStatus(id: string) {
  const error = {
    error: true,
    message: "You have no permission to update a job listing status",
  };

  const { orgId } = await getCurrentOrganization();

  const hasPermission = await hasOrgUserPermission("job_listing:update");

  if (orgId == null || !hasPermission) return error;

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) return error;

  const newStatus = getNextJobListingStatus(jobListing.status);

  // checking permissions
  if (
    ((await hasOrgUserPermission("job_listing:change_status")) ||
      (newStatus === "published" &&
        (await hasReachedMaxPublishedJobListings()))) === false
  ) {
    return error;
  }

  await updateJobListingDB(id, {
    status: newStatus,
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt:
      newStatus === "published" && jobListing.postedAt == null
        ? new Date()
        : undefined,
  });

  return { error: false };
}

export async function toggleJobListingFeatured(id: string) {
  const error = {
    error: true,
    message: "You have no permission to update a job listing featured status",
  };

  const { orgId } = await getCurrentOrganization();

  const hasPermission = await hasOrgUserPermission("job_listing:update");

  if (orgId == null || !hasPermission) return error;

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) return error;

  const newFeaturedStatus = !jobListing.isFeatured;

  // checking permissions
  if (
    ((await hasOrgUserPermission("job_listing:change_status")) ||
      (newFeaturedStatus && (await hasReachedMaxFeaturedJobListings()))) ===
    false
  ) {
    return error;
  }

  await updateJobListingDB(id, {
    isFeatured: newFeaturedStatus,
  });

  return { error: false };
}

export async function deleteJobListing(id: string) {
  const error = {
    error: true,
    message: "You have no permission to delete a job listing.",
  };

  const { orgId } = await getCurrentOrganization();

  const hasPermission = await hasOrgUserPermission("job_listing:delete");

  if (orgId == null || !hasPermission) return error;

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) return error;

  await deleteJobListingDB(id);

  redirect("/employer");
  return { error: false };
}

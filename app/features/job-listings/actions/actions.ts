"use server";

import z from "zod";
import { JobListingSchema } from "./schemas";
import { getCurrentOrganaization } from "@/app/services/clerk/components/lib/get-current-auth";
import { redirect } from "next/navigation";
import { insertJobListing } from "../db/job-listings";

export async function createJobListing(
  unsaveData: z.infer<typeof JobListingSchema>
) {
  const { orgId } = await getCurrentOrganaization();

  if (orgId == null) {
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

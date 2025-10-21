"use server";

import z from "zod";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/get-current-auth";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import {
  ApplicationStage,
  applicationStages,
  JobLIstingApplicationTable,
  JobListingTable,
  UserResumeTable,
} from "@/drizzle/schemas";
import { getUserResumeIdTAg } from "@/features/users/db/cache/user-resumes";
import { getJobListingIdTag } from "../../job-listings/db/cache/job-listings";
import { jobListingApplicationSchema } from "../../job-listing-applications/actions/schemas";
import {
  insertJobListingApplication,
  updateJobListingApplication,
} from "../db/job-listing-applications";
import { inngest } from "@/services/inngest/client";
import { getJobListingApplicationIdTag } from "../db/cache/job-listing-applications";
import { hasOrgUserPermission } from "@/services/clerk/lib/org-user-permissions";

export async function createJobListingApplication(
  jobListingId: string,
  unsafeData: z.infer<typeof jobListingApplicationSchema>
) {
  const permissionError = {
    error: true,
    message: "You don't have permission to submit an application",
  };

  const { userId } = await getCurrentUser();

  if (userId == null) {
    return permissionError;
  }

  const userJobListingApplication = await getUserJobListingApplication(
    userId,
    jobListingId
  );

  if (userJobListingApplication) {
    return {
      error: true,
      message: "You have Already applied to this job.",
    };
  }

  const [userResume, jobListing] = await Promise.all([
    getUserResume(userId),
    getPublishJobListing(jobListingId),
  ]);

  if (userResume == null || jobListing == null) return permissionError;

  const { success, data } = jobListingApplicationSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "There is an error submitting your application",
    };
  }

  await insertJobListingApplication({
    jobListingId,
    userId,
    ...data,
  });

  await inngest.send({
    name: "App/job-listing-application.created",
    data: { jobListingId, userId },
  });

  return {
    error: false,
    message: "Your application was successfully submitted",
  };
}

// update job listing application stage
export async function updateJobListingApplicationStage(
  {
    jobListingId,
    userId,
  }: {
    jobListingId: string;
    userId: string;
  },
  unsafeStage: ApplicationStage
) {
  const { success, data: stage } = z
    .enum(applicationStages)
    .safeParse(unsafeStage);

  if (!success) {
    return {
      error: true,
      message: "Invalid Stage",
    };
  }

  if (!(await hasOrgUserPermission("job_listing_application:change_stage"))) {
    return {
      error: true,
      message: "You have no permission to update this application",
    };
  }

  const { orgId } = await getCurrentOrganization();
  const jobListing = await getJobListing(jobListingId);

  if (
    orgId == null ||
    jobListing == null ||
    orgId !== jobListing.organizationId
  ) {
    return {
      error: true,
      message: "You have no permission to update this application",
    };
  }

  await updateJobListingApplication(
    { jobListingId, userId },
    {
      stage,
    }
  );

  return { error: false, message: "Job listing stage updated successfully" };
}

// update job listing application stage
export async function updateJobListingApplicationRating(
  {
    jobListingId,
    userId,
  }: {
    jobListingId: string;
    userId: string;
  },
  unsafeRating: number | null
) {
  const { success, data: rating } = z
    .number()
    .min(1)
    .max(5)
    .nullable()
    .safeParse(unsafeRating);

  if (!success) {
    return {
      error: true,
      message: "Invalid Rating",
    };
  }

  if (!(await hasOrgUserPermission("job_listing_application:change_stage"))) {
    return {
      error: true,
      message: "You have no permission to update this application",
    };
  }

  const { orgId } = await getCurrentOrganization();
  const jobListing = await getJobListing(jobListingId);

  if (
    orgId == null ||
    jobListing == null ||
    orgId !== jobListing.organizationId
  ) {
    return {
      error: true,
      message: "You have no permission to update this application",
    };
  }

  await updateJobListingApplication(
    { jobListingId, userId },
    {
      rating,
    }
  );

  return { error: false, message: "Job listing rating updated successfully" };
}

async function getUserJobListingApplication(
  userId: string,
  jobListingId: string
) {
  "use cache";
  cacheTag(getJobListingApplicationIdTag({ userId, jobListingId }));

  return db.query.JobLIstingApplicationTable.findFirst({
    where: and(
      eq(JobLIstingApplicationTable.userId, userId),
      eq(JobLIstingApplicationTable.jobListingId, jobListingId)
    ),
    columns: {
      userId: true,
    },
  });
}

async function getPublishJobListing(id: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published")
    ),
    columns: { id: true },
  });
}

async function getUserResume(userId: string) {
  "use cache";
  cacheTag(getUserResumeIdTAg(userId));

  return db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
    columns: { userId: true },
  });
}

async function getJobListing(jobListingId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(jobListingId));

  return db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.id, jobListingId),
    columns: { organizationId: true },
  });
}

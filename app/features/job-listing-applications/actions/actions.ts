"use server";

import z from "zod";
import { getCurrentUser } from "@/app/services/clerk/lib/get-current-auth";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import {
  JobLIstingApplicationTable,
  JobListingTable,
  UserResumeTable,
} from "@/drizzle/schemas";
import { getUserResumeIdTAg } from "@/app/features/users/db/cache/user-resumes";
import { getJobListingIdTag } from "../../job-listings/db/cache/job-listings";
import { jobListingApplicationSchema } from "../../job-listing-applications/actions/schemas";
import { insertJobListingApplication } from "../db/job-listing-applications";
import { inngest } from "@/app/services/inngest/client";
import { getJobListingApplicationIdTag } from "../db/cache/job-listing-applications";

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

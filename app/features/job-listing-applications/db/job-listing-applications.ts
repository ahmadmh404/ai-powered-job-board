import { db } from "@/drizzle/db";
import { JobLIstingApplicationTable } from "@/drizzle/schema/job-listing-application";
import { and, eq } from "drizzle-orm";
import { revalidateJobListingApplicationCache } from "./cache/job-listing-applications";

export async function insertJobListingApplication(
  data: typeof JobLIstingApplicationTable.$inferInsert
) {
  await db.insert(JobLIstingApplicationTable).values(data);
}

export async function updateJobListingApplication(
  {
    userId,
    jobListingId,
  }: {
    userId: string;
    jobListingId: string;
  },
  data: Partial<
    Omit<
      typeof JobLIstingApplicationTable.$inferInsert,
      'userId | "jobListingId'
    >
  >
) {
  await db
    .update(JobLIstingApplicationTable)
    .set(data)
    .where(
      and(
        eq(JobLIstingApplicationTable.userId, userId),
        eq(JobLIstingApplicationTable.jobListingId, jobListingId)
      )
    );

  revalidateJobListingApplicationCache({ jobListingId, userId });
}

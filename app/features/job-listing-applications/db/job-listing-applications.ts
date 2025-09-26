import { db } from "@/drizzle/db";
import { JobLIstingApplicationTable } from "@/drizzle/schema/job-listing-application";

export async function insertJobListingApplication(
  data: typeof JobLIstingApplicationTable.$inferInsert
) {
  await db.insert(JobLIstingApplicationTable).values(data);
}

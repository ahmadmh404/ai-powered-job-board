import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { and, eq } from "drizzle-orm";
import {
  JobLIstingApplicationTable,
  JobListingTable,
  UserResumeTable,
} from "@/drizzle/schema";
import { applicantRankingAgent } from "../ai/applicant-ranking-agent";

// rank the applicant when he apply to a job
export const rankingApplicant = inngest.createFunction(
  {
    id: "rank applicant",
    name: "Rank Applicant",
  },
  { event: "app/jobListingApplication.created" },
  async ({ step, event }) => {
    const { userId, jobListingId } = event.data;

    // when you are not awaiting the inngest steps you want it to run in parallel

    // get cover letter
    const getCoverLetter = step.run("get-cover-letter", async () => {
      const application = await db.query.JobLIstingApplicationTable.findFirst({
        where: and(
          eq(JobLIstingApplicationTable.userId, userId),
          eq(JobLIstingApplicationTable.jobListingId, jobListingId)
        ),
        columns: {
          coverLetter: true,
        },
      });

      return application?.coverLetter;
    });

    // get user resume ai summary
    const getAISummary = step.run("get-ai-summary", async () => {
      const resume = await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: { aiSummary: true },
      });

      return resume?.aiSummary;
    });

    // get job listing
    const getJobListing = step.run("get-job-listing", async () => {
      return await db.query.JobListingTable.findFirst({
        where: eq(JobListingTable.id, jobListingId),
        columns: {
          id: true,
          title: true,
          type: true,
          description: true,
          city: true,
          wage: true,
          wageInterval: true,
          experienceLevel: true,
          locationRequirement: true,
          status: true,
          stateAbbreviation: true,
        },
      });
    });

    const [coverLetter, resumeSummary, jobListing] = await Promise.all([
      getCoverLetter,
      getAISummary,
      getJobListing,
    ]);

    if (coverLetter == null || jobListing == null) return;

    await applicantRankingAgent.run(
      JSON.stringify({ coverLetter, resumeSummary, jobListing })
    );
  }
);

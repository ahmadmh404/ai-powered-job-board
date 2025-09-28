import { updateJobListingApplication } from "@/app/features/job-listing-applications/db/job-listing-applications";
import { env } from "@/data/env/server";
import { createAgent, createTool } from "@/inngest/agent-kit";
import { models } from "inngest";
import z from "zod";

const saveApplicantRatingTool = createTool({
  name: "SAve Applicant Raking",
  description:
    "Saves the applicant's ranking for a specific job listing in the database",
  parameters: z.object({
    rating: z.number().int().max(5).min(1),
    jobListingId: z.string(),
    userId: z.string(),
  }),

  handler: async ({ rating, jobListingId, userId }) => {
    await updateJobListingApplication({ userId, jobListingId }, { rating });

    return "Successfully saved applicant rating score";
  },
});

export const applicantRankingAgent = createAgent({
  name: "Applicant Ranking Agent",
  description:
    "Agent for ranking job applications for specific job listings based on their resume and cover letter",
  system: `You are an expert ata ranking job applications for specific jobs based on their resume and cover letter.
     You will be provided with a user prompt includes the user's id, it's resume and cover letter as well as the 
     job listing they are applying for in JSON. Your task is to compare the applicant's resume and cover letter with that 
    specified job listing on how will they fit this job. The rating should be number between 1 and 5. rating of 5 means 
    perfect or near the perfect match, a rating of 3 is for applicants that barely meet the requirements, 
    a rating of 1 is for applicants that doesn't meet the requirements at all.
    You should save the user rating in the database and not return any output`,
  tools: [saveApplicantRatingTool],
  models: gemini({
    model: "gemini-2.0-flash",
    apiKey: env.GEMINI_API_KEY,
  }),
});

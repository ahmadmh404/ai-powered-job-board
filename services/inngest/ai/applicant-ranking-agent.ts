import { updateJobListingApplication } from "@/features/job-listing-applications/db/job-listing-applications";
import { env } from "@/data/env/server";
import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { z } from "zod";
import {
  GROQ_BASE_URL,
  AI_MODELS,
} from "@/features/job-listing-applications/data/constants";

const saveApplicantRatingTool = createTool({
  name: "save-applicant-ranking",
  description:
    "Saves the applicant's ranking for a specific job listing in the database",
  parameters: z.object({
    rating: z.number().int().max(5).min(1),
    jobListingId: z.string(),
    userId: z.string(),
  }),
  handler: async ({ jobListingId, rating, userId }) => {
    await updateJobListingApplication({ jobListingId, userId }, { rating });

    return "Successfully saved applicant ranking score.";
  },
});

export const applicantRankingAgent = createAgent({
  name: "Applicant Ranking Agent",
  description:
    "Agent for ranking job applicants for specific job listings based on their resume and cover letter.",
  system: `You are an expert at ranking job applicants for specific jobs based on their resume summary and cover letter. 
You will receive a JSON object containing userId, jobListing (including its id), resumeSummary, and coverLetter. 
Compare the job listing requirements with the applicant's resume summary and cover letter, then assign an integer rating from 1 to 5:
- 5: Perfect or near-perfect match
- 4: Strong match meeting almost all requirements
- 3: Barely meets the core requirements
- 2: Weak match missing key requirements
- 1: Does not meet requirements at all

You MUST call the "save-applicant-ranking" tool with the exact userId, jobListing.id as jobListingId, and your integer rating. After calling the tool, stop and do not return extra text.`,
  tools: [saveApplicantRatingTool],
  model: openai({
    model: AI_MODELS.HIGH_REASONING,
    baseUrl: GROQ_BASE_URL,
    apiKey: env.GROQ_API_KEY,
  }),
});

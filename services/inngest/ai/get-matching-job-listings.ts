import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schemas";
import { createAgent, gemini, openai } from "@inngest/agent-kit";
import * as z from "zod";
import { getLastOutputMessage } from "./get-last-output-message";
import { env } from "@/data/env/server";
import {
  GROQ_BASE_URL,
  AI_MODELS,
  CEREBRAS_BASE_URL,
} from "@/features/job-listing-applications/data/constants";

const listingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  wage: z.number().nullable(),
  wageInterval: z.enum(wageIntervals).nullable(),
  city: z.string().nullable(),
  stateAbbreviation: z.string().nullable(),
  experienceLevel: z.enum(experienceLevels),
  type: z.enum(jobListingTypes),
  locationRequirement: z.enum(locationRequirements),
});

interface Props {
  prompt: string;
  jobListings: z.infer<typeof listingSchema>[];
  options?: { maxNumberOfJobs?: number };
}
export async function getMatchingJobListing({
  jobListings,
  prompt,
  options: { maxNumberOfJobs } = {},
}: Props) {
  if (jobListings.length === 0) return [];

  const NO_JOBS = "NO_JOBS";

  const compactListings = jobListings.map((listing) => {
    const parsed = listingSchema.parse(listing);
    return {
      id: parsed.id,
      title: parsed.title,
      // Truncate long descriptions so 50+ jobs still fit easily in one prompt
      description: parsed.description.slice(0, 800),
      wage: parsed.wage ?? undefined,
      wageInterval: parsed.wageInterval ?? undefined,
      city: parsed.city ?? undefined,
      stateAbbreviation: parsed.stateAbbreviation ?? undefined,
      experienceLevel: parsed.experienceLevel,
      type: parsed.type,
      locationRequirement: parsed.locationRequirement,
    };
  });

  const agent = createAgent({
    name: "Job Listings Agent",
    description: "Agent for matching users with job listings",
    system: `You are an expert at matching people with jobs based on their specific experience and requirements. The user prompt describes their background and what they are looking for. ${
      maxNumberOfJobs
        ? `Return up to ${maxNumberOfJobs} matching jobs.`
        : `Return all jobs that match their requirements.`
    }
STRICT OUTPUT RULES:
- Return ONLY a comma-separated list of matching job IDs (e.g. id1,id2,id3) with NO extra text, markdown, or explanation.
- If no jobs match, return ONLY the exact string "${NO_JOBS}".

Available job listings JSON:
${JSON.stringify(compactListings)}`,
    model: openai({
      model: AI_MODELS.HIGH_REASONING,
      baseUrl: GROQ_BASE_URL,
      apiKey: env.GROQ_API_KEY,
    }),
  });

  const result = await agent.run(prompt);
  const lastMessage = getLastOutputMessage(result)?.trim();

  if (!lastMessage || lastMessage === NO_JOBS) return [];

  // Filter against valid IDs in case the model hallucinates or adds extra words
  const validIds = new Set(jobListings.map((j) => j.id));
  return lastMessage
    .split(",")
    .map((jobId) => jobId.trim())
    .filter((jobId) => validIds.has(jobId));
}

import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schemas";
import { env } from "@/data/env/server";
import { updateUserResume } from "@/features/users/db/user-resumes";
import { fetchUploadThingFile } from "@/lib/fetch-uploadthing-fiile";
import { NonRetriableError } from "inngest";
import {
  GROQ_BASE_URL,
  AI_MODELS,
} from "@/features/job-listing-applications/data/constants";

export const createAiSummaryOfUploadedResume = inngest.createFunction(
  {
    id: "create-ai-summary-of-uploaded-resume",
    name: "Create AI Summary of Uploaded Resume",
  },
  {
    event: "App/resume.uploaded",
  },
  async ({ step, event }) => {
    const { id: userId } = event.user;

    const userResume = await step.run("get-user-resume", async () => {
      return await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: { resumeFileUrl: true },
      });
    });

    if (userResume == null) return;

    // Downloading the Resume data
    const resume = await step.run("download-resume-data", async () => {
      try {
        return await fetchUploadThingFile(userResume.resumeFileUrl);
      } catch (error) {
        throw new NonRetriableError(
          error instanceof Error
            ? error.message
            : "File couldn't be processed.",
        );
      }
    });

    const result = await step.ai.infer("create-ai-summary", {
      model: step.ai.models.openai({
        baseUrl: GROQ_BASE_URL,
        model: AI_MODELS.LOW_REASONING,
        apiKey: env.GROQ_API_KEY,
      }),
      body: {
        messages: [
          {
            role: "system",
            content:
              "You are an expert technical recruiter. Summarize the provided resume clearly in markdown, highlighting key skills, years of experience, notable roles, and education so hiring managers can quickly evaluate the candidate.",
          },
          {
            role: "user",
            content: `Please summarize this resume:\n\n${resume.text}`,
          },
        ],
      },
    });

    const aiSummary = result.choices?.[0]?.message?.content;
    if (!aiSummary) return;

    await step.run("save-ai-summary", async () => {
      await updateUserResume(userId, { aiSummary });
    });
  },
);

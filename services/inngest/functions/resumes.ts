import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schemas";
import { env } from "@/data/env/server";
import { updateUserResume } from "@/features/users/db/user-resumes";
import { fetchUploadThingFile } from "@/lib/fetch-uploadthing-fiile";
import { NonRetriableError } from "inngest";

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
        throw new NonRetriableError("File Weren't Found!");
      }
    });

    const result = await step.ai.infer("create-ai-summary", {
      model: step.ai.models.gemini({
        model: "gemini-3.8-flash",
        defaultParameters: {},
        apiKey: env.GEMINI_API_KEY,
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: resume,
              },
              {
                text: "Summarize the following resume and extract all key skills, experience, and qualifications. The summary should include all the information that a hiring manager would need to know about the candidate in order to determine if they are a good fit for a job. This summary should be formatted as markdown. Do not return any other text. If the file does not look like a resume return the text 'N/A'.",
              },
            ],
          },
        ],
      },
    });

    // Getting the message content.
    if (result.candidates == null || result.candidates.length === 0) return;
    const message = result.candidates[0].content.parts[0];

    console.log({ message });

    await step.run("save-ai-summary", async () => {
      if ("text" in message) {
        await updateUserResume(userId, { aiSummary: message.text });
      }
    });
  },
);

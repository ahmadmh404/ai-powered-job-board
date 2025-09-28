import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schema";
import { env } from "@/data/env/server";
import { updateUserResume } from "@/app/features/usres/db/user-resumes";

export const createAISummaryForUploadedResume = inngest.createFunction(
  {
    id: "create ai summary for uploaded summary",
    name: "Create AI Summary For Uploaded Summary",
  },
  {
    event: "app/resume.uploaded",
  },
  async ({ step, event }) => {
    const { id: userId } = event.user;

    const userResume = await step.run("get ure resume file url", async () => {
      return await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: {
          resumeFileUrl: true,
        },
      });
    });

    if (userResume == null) return;

    // get ai summary with inngest ai help
    const result = await step.ai.infer("create ai summary", {
      model: step.ai.models.anthropic({
        model: "claude-3-5-haiku-latest",
        defaultParameters: { max_tokens: 2048 },
        apiKey: env.ANTHROPIC_API_KEY,
      }),
      body: {
        messages: [
          // 1- send the resume file
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "url",
                  url: userResume.resumeFileUrl,
                },
              },
              {
                type: "text",
                text: `Summarize the following resume, and extract all key skills,
                 experiences and qualifications. The summary should include all the information
                 a hiring manger would need to know about a candidate in order to determine if they
                 are a good fit for a job. The summary should be formatted as markdown. 
                 Do not send any other text. If the file does not look like a resume send the text 'N/A.'`,
              },
            ],
          },
        ],
      },
    });

    // save ai summary
    await step.run("save ai summary", async () => {
      const message = result.content[0];

      if (message.type !== "text") return;

      await updateUserResume(userId, {
        aiSummary: message.text,
      });
    });
  }
);

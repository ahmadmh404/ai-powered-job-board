import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentUser } from "../clerk/lib/get-current-auth";
import { inngest } from "../inngest/client";
import { upsertUserResume } from "@/app/features/usres/db/user-resumes";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schema";
import { uploadthing } from "./client";

const f = createUploadthing();

export const customFleRouter = {
  resumeUploader: f(
    {
      pdf: {
        maxFileSize: "8MB",
        maxFileCount: 1,
      },
    },
    {
      awaitServerData: true,
    }
  )
    .middleware(async () => {
      const { userId } = await getCurrentUser();

      if (userId == null) throw new UploadThingError("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId } = metadata;

      const fileKey = await getUserResumeKey(userId);

      await upsertUserResume(userId, {
        resumeFileKey: file.key,
        resumeFileUrl: file.ufsUrl,
      });

      if (fileKey != null) {
        uploadthing.deleteFiles(fileKey);
      }

      inngest.send({
        name: "app/resume.uploaded",
        user: { id: userId },
      });

      return { message: "Resume uploaded successfully" };
    }),
} satisfies FileRouter;

export type CustomFileROuter = typeof customFleRouter;

// to replace the file in with the same key instead of creating a new file and run out of storage limitation
async function getUserResumeKey(userId: string) {
  const data = await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
    columns: {
      resumeFileKey: true,
    },
  });

  return data?.resumeFileKey;
}

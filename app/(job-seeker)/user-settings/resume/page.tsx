import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { DropZoneCLient } from "./uploadthing-dropzone-client";
import { getCurrentUser } from "@/services/clerk/lib/get-current-auth";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schemas";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getUserResumeIdTAg } from "@/features/users/db/cache/user-resumes";
import MarkdownRenderer from "@/components/markdown/markdown-renderer";

export default function UserResumePage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <h2 className="text-2xl font-bold">Upload your resume</h2>
      <Card>
        <CardContent>
          <DropZoneCLient />
        </CardContent>
        <Suspense>
          <ResumeDetails />
        </Suspense>
      </Card>

      <Suspense>
        <AISummary />
      </Suspense>
    </div>
  );
}

async function ResumeDetails() {
  const { userId } = await getCurrentUser();

  if (userId == null) return notFound();

  const userResume = await getUserResume(userId);

  if (userResume == null) return null;

  return (
    <CardFooter>
      <Button asChild>
        <Link
          href={userResume.resumeFileUrl}
          target="_black"
          rel="noopener noreferrer"
        >
          View Resume
        </Link>
      </Button>
    </CardFooter>
  );
}

async function getUserResume(userId: string) {
  "use cache";
  cacheTag(getUserResumeIdTAg(userId));

  return db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
  });
}

async function AISummary() {
  const { userId } = await getCurrentUser();

  if (userId == null) return notFound();

  const userResume = await getUserResume(userId);

  if (userResume == null || userResume.aiSummary == null) return null;

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>AO Summary</CardTitle>
        <CardDescription>
          This is AI generated summary of your resume. This is used by employers
          to quickly understand your qualifications and experience
        </CardDescription>
      </CardHeader>

      <CardContent>
        <MarkdownRenderer source={userResume.aiSummary} />
      </CardContent>
    </Card>
  );
}

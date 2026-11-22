import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SignUpButton } from "@/services/clerk/components/auth-buttons";
import { getCurrentUser } from "@/services/clerk/lib/get-current-auth";
import NewJobListingApplicationForm from "./new-job-listing-application-form";
import { cacheTag } from "next/cache";
import { getUserResumeIdTAg } from "@/features/users/db/cache/user-resumes";
import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { JobLIstingApplicationTable, UserResumeTable } from "@/drizzle/schemas";
import { getJobListingApplicationIdTag } from "../db/cache/job-listing-applications";
import { differenceInDays } from "date-fns";
import { connection } from "next/server";
import Link from "next/link";

export async function ApplyButton({ jobListingId }: { jobListingId: string }) {
  const { userId } = await getCurrentUser();

  if (userId == null) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>Apply</Button>
        </PopoverTrigger>

        <PopoverContent className="flex flex-col gap-2">
          You need to create an account before applying fo a ob
          <SignUpButton />
        </PopoverContent>
      </Popover>
    );
  }

  const application = await getJobListingApplication(jobListingId, userId);

  if (application != null) {
    const formatter = new Intl.RelativeTimeFormat(undefined, {
      style: "short",
      numeric: "always",
    });

    await connection();
    const difference = differenceInDays(application.createdAt, new Date());

    return (
      <div className="text-muted-foreground text-sm">
        You have applied for this job{" "}
        {difference === 0 ? "Today" : formatter.format(difference, "days")}
      </div>
    );
  }

  const userResume = await getUserResume(userId);

  if (userResume == null) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>Apply</Button>
        </PopoverTrigger>

        <PopoverContent className="flex flex-col gap-2">
          You need to upload a resume to apply for a job.
          <Button asChild>
            <Link href={"/user-settings/resume"}>Upload Resume</Link>
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Apply</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl flex flex-col max-h-[calc(100% - 2rem)] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Application</DialogTitle>
          <DialogDescription>
            Applying for a job cannot be undone and is something that you can
            onl do once per job listing.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1">
          <NewJobListingApplicationForm jobListingId={jobListingId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

async function getUserResume(userId: string) {
  "use cache";

  cacheTag(getUserResumeIdTAg(userId));

  return db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
  });
}

async function getJobListingApplication(jobListingId: string, userId: string) {
  "use cache";

  cacheTag(getJobListingApplicationIdTag({ jobListingId, userId }));

  return db.query.JobLIstingApplicationTable.findFirst({
    where: and(
      eq(JobLIstingApplicationTable.jobListingId, jobListingId),
      eq(JobLIstingApplicationTable.userId, userId),
    ),
  });
}

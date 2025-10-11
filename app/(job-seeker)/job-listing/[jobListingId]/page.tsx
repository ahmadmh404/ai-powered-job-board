import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import JobListingItems, {
  DaysSincePosting,
} from "../../_shared/job-listing-items";
import IsBreakPoint from "@/components/is-break-point";
import { Suspense } from "react";
import LoadingSpinner from "@/components/loading-sinner";
import ClientSheet from "./_client-sheet";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobListingIdTag } from "@/features/job-listings/db/cache/job-listings";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import {
  JobLIstingApplicationTable,
  JobListingTable,
  UserResumeTable,
} from "@/drizzle/schemas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { convertSearchParamsToString } from "@/lib/convert-search-params-to-string";
import { XIcon } from "lucide-react";
import JobListingBadges from "@/features/job-listings/components/job-listing-badges";
import MarkdownRenderer from "@/components/markdown/markdown-renderer";
import { getCurrentUser } from "@/services/clerk/lib/get-current-auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SignUpButton } from "@/services/clerk/components/auth-buttons";
import { getJobListingApplicationIdTag } from "@/features/job-listing-applications/db/cache/job-listing-applications";
import { differenceInDays } from "date-fns";
import { connection } from "next/server";
import { getUserResumeIdTAg } from "@/features/users/db/cache/user-resumes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewJobListingApplicationForm from "@/features/job-listing-applications/components/new-job-listing-application-form";

type Props = {
  params: Promise<{ jobListingId: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default function JobListingPage({ params, searchParams }: Props) {
  return (
    <>
      <ResizablePanelGroup autoSaveId="job_board_panel" direction="horizontal">
        <ResizablePanel id="left" order={1} minSize={30} maxSize={60}>
          <div className="p-4 h-screen overflow-y-auto">
            <JobListingItems searchParams={searchParams} params={params} />
          </div>
        </ResizablePanel>

        <IsBreakPoint
          breakPoint="min-width:1024px"
          otherwise={
            <ClientSheet>
              <SheetContent className="p-4 overflow-y-auto" hideCloseButton>
                <SheetHeader>
                  <SheetTitle>Job Listing Details</SheetTitle>
                </SheetHeader>

                <Suspense fallback={<LoadingSpinner />}>
                  <JobListingDetails
                    searchParams={searchParams}
                    params={params}
                  />
                </Suspense>
              </SheetContent>
            </ClientSheet>
          }
        >
          <ResizableHandle withHandle className="mx-2" />
          <ResizablePanel id="right" order={2} minSize={30} defaultSize={30}>
            <div className="p-3 h-screen overflow-y-aut">
              <Suspense fallback={<LoadingSpinner />}>
                <JobListingDetails
                  searchParams={searchParams}
                  params={params}
                />
              </Suspense>
            </div>
          </ResizablePanel>
        </IsBreakPoint>
      </ResizablePanelGroup>
    </>
  );
}

async function JobListingDetails({ params, searchParams }: Props) {
  const { jobListingId } = await params;

  const jobListing = await getJobListing(jobListingId);

  if (jobListing == null) {
    return null;
  }

  const nameInitials = jobListing.organization.name
    .split(" ")
    .splice(0, 4)
    .map((word) => word[0])
    .join("");

  return (
    <div className="space-y-6 @container">
      <div className="space-y-4">
        <div className="flex gap-3 items-start">
          <Avatar className="size-14 @max-sm:hidden">
            <AvatarImage
              src={jobListing.organization.imageUrl ?? undefined}
              alt={jobListing.organization.name}
            />
            <AvatarFallback className="uppercase bg-primary text-muted-foreground">
              {nameInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {jobListing.title}
            </h1>

            <div className="text-base text-muted-foreground">
              {jobListing.organization.name}
            </div>

            {jobListing.postedAt != null && (
              <div className="text-sm font-medium text-primary ml-auto @min-md:hidden">
                <Suspense>
                  <DaysSincePosting postedAt={jobListing.postedAt} />
                </Suspense>
              </div>
            )}
          </div>

          {jobListing.postedAt != null && (
            <div className="text-sm font-medium text-primary ml-auto mt-2 @max-md:hidden">
              <Suspense>
                <DaysSincePosting postedAt={jobListing.postedAt} />
              </Suspense>
            </div>
          )}

          <Button variant={"outline"} size={"icon"} asChild>
            <Link
              href={`/${convertSearchParamsToString(await searchParams)}`}
              className="ml-auto"
            >
              <span className="sr-only">Close</span>
              <XIcon />
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 mt-2">
          <JobListingBadges jobListing={jobListing} />
        </div>

        <Suspense fallback={<Button disabled>Apply</Button>}>
          <ApplyButton jobListingId={jobListing.id} />
        </Suspense>
      </div>

      {/* Job Listing Markdown */}
      <MarkdownRenderer source={jobListing.description} />
    </div>
  );
}

async function ApplyButton({ jobListingId }: { jobListingId: string }) {
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
      eq(JobLIstingApplicationTable.userId, userId)
    ),
  });
}

async function getJobListing(id: string) {
  "use cache";

  cacheTag(getJobListingIdTag(id));
  const listing = await db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published")
    ),
    with: {
      organization: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  if (listing != null) {
    cacheTag(getJobListingIdTag(listing.id));
  }

  return listing;
}

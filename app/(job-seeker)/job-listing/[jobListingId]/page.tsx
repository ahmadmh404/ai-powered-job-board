import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
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
import { JobListingTable } from "@/drizzle/schemas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { convertSearchParamsToString } from "@/lib/convert-search-params-to-string";
import { XIcon } from "lucide-react";
import JobListingBadges from "@/features/job-listings/components/job-listing-badges";
import MarkdownRenderer from "@/components/markdown/markdown-renderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApplyButton } from "@/features/job-listing-applications/components/apply-button";

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
              <SheetContent
                className="p-5 pr-4 overflow-y-auto min-w-[500px]"
                hideCloseButton
              >
                <SheetHeader>
                  <SheetTitle>Job Listin;g Details</SheetTitle>
                </SheetHeader>

                <Suspense fallback={<JobListingDetailsSkeleton />}>
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
          <ResizablePanel
            id="right"
            order={2}
            minSize={30}
            maxSize={60}
            defaultSize={30}
          >
            <div className="p-3 h-screen overflow-y-aut">
              <Suspense fallback={<JobListingDetailsSkeleton />}>
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
    <ScrollArea className="h-full">
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
              <div className="text-sm font-medium text-primary ml-auto @max-md:hidden">
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
    </ScrollArea>
  );
}

export function JobListingDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading job listing details"
      className="space-y-6 @container"
    >
      <span className="sr-only">Loading job listing details...</span>

      <div className="space-y-4">
        {/* Header row: Avatar, Title/Org/Date, Close button */}
        <div className="flex gap-3 items-start">
          <Skeleton className="size-14 rounded-full shrink-0 @max-sm:hidden" />

          <div className="flex flex-col flex-1 min-w-0 gap-1.5">
            <Skeleton className="h-7 w-3/4 max-w-md" />
            <Skeleton className="h-5 w-2/5 max-w-[220px]" />

            {/* Mobile posted-at slot (`@min-md:hidden`) */}
            <Skeleton className="h-4 w-16 mt-0.5 @min-md:hidden" />
          </div>

          {/* Desktop posted-at slot (`@max-md:hidden`) */}
          <Skeleton className="h-4 w-14 shrink-0 @max-md:hidden" />

          {/* Close button (`size="icon"`) */}
          <Skeleton className="size-9 rounded-md shrink-0" />
        </div>

        {/* JobListingBadges row */}
        <div className="flex flex-wrap gap-3 mt-2">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>

        {/* Apply button */}
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      {/* Job listing description / markdown body */}
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

async function getJobListing(id: string) {
  "use cache";

  cacheTag(getJobListingIdTag(id));
  const listing = await db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published"),
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

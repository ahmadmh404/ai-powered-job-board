import JobListingBadges from "@/app/features/job-listings/components/job-listing-badges";
import { getJobListingIdTag } from "@/app/features/job-listings/db/cache/job-listings";
import { formatJobListingStatus } from "@/app/features/job-listings/util/formators";
import { getCurrentOrganaization } from "@/app/services/clerk/components/lib/get-current-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { EditIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

type Props = {
  params: Promise<{ jobListingId: string }>;
};

export default function JobListingPage({ params }: Props) {
  return (
    <Suspense>
      <SuspensedPage params={params} />
    </Suspense>
  );
}

async function SuspensedPage({ params }: Props) {
  const { orgId } = await getCurrentOrganaization();

  if (orgId == null) {
    return null;
  }

  const { jobListingId } = await params;

  const jobListing = await getJobListing(jobListingId, orgId);

  if (jobListing == null) {
    return notFound();
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        {/* Job Listing Content */}
        <div>
          <h1 className="text-2xl tracking-tight font-bold">
            {jobListing.title}
          </h1>

          <div className="flex flex-wrap gap-3 mt-2">
            <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
            <JobListingBadges jobListing={jobListing} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 empty:-mt-4">
          <Button variant={"outline"} asChild>
            <Link href={`/employer/job-listing/${jobListing.id}/edit`}>
              <EditIcon className="size-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <MarkdownPartial
        dialogMardown={<MarkdownRenderder source={jobListing.description} />}
        mainMarkdown={
          <MarkdownRenderer
            className="prose-sm"
            source={jobListing.description}
          />
        }
        dialogTitle="Descriiption"
      />
    </div>
  );
}

async function getJobListing(id: string, orgId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, orgId)
    ),
  });
}

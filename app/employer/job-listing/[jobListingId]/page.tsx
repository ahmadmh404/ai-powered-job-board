import {
  deleteJobListing,
  toggleJobListingFeatured,
  toggleJobListingStatus,
} from "@/features/job-listings/actions/actions";
import JobListingBadges from "@/features/job-listings/components/job-listing-badges";
import UpgradePopover, {
  JobListingSFeaturedText,
  JobListingStatusText,
} from "@/features/job-listings/components/upgrade-popover";
import { getJobListingIdTag } from "@/features/job-listings/db/cache/job-listings";
import { formatJobListingStatus } from "@/features/job-listings/lib/formatters";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "@/features/job-listings/lib/plan-features-helpers";
import { getNextJobListingStatus } from "@/features/job-listings/lib/utils";
import { getCurrentOrganization } from "@/services/clerk/lib/get-current-auth";
import { hasOrgUserPermission } from "@/services/clerk/lib/org-user-permissions";
import ActionButton from "@/components/action-button";
import AsyncIf from "@/components/async-if";
import { MarkdownPartial } from "@/components/markdown/markdown-partial";
import MarkdownRenderer from "@/components/markdown/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { JobListingStatus, JobListingTable } from "@/drizzle/schemas";
import { and, eq } from "drizzle-orm";
import { EditIcon, Trash2Icon } from "lucide-react";
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
      <SuspendedPage params={params} />
    </Suspense>
  );
}

async function SuspendedPage({ params }: Props) {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null) {
    return null;
  }

  const { jobListingId } = await params;

  const jobListing = await getJobListing(jobListingId, orgId);

  if (jobListing == null) {
    return notFound();
  }

  const editPermission = () => hasOrgUserPermission("job_listing:update");
  const deletePermission = () => hasOrgUserPermission("job_listing:delete");

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
          <AsyncIf condition={editPermission}>
            <Button variant={"outline"} asChild>
              <Link href={`/employer/job-listing/${jobListing.id}/edit`}>
                <EditIcon className="size-4" />
                Edit
              </Link>
            </Button>
          </AsyncIf>

          <ToggleJobListingStatusButton
            id={jobListing.id}
            status={jobListing.status}
          />

          {jobListing.status === "published" && (
            <ToggleJobListingIsFeatureButton
              id={jobListing.id}
              isFeatured={jobListing.isFeatured}
            />
          )}

          <AsyncIf condition={deletePermission}>
            <ActionButton
              variant={"destructive"}
              action={deleteJobListing.bind(null, jobListing.id)}
              requireAreYouSure
            >
              <Trash2Icon className="size-4" />
              Delete
            </ActionButton>
          </AsyncIf>
        </div>
      </div>

      <MarkdownPartial
        dialogMarkdown={<MarkdownRenderer source={jobListing.description} />}
        mainMarkdown={
          <MarkdownRenderer
            className="prose-sm"
            source={jobListing.description}
          />
        }
        dialogTitle="Description"
      />
    </div>
  );
}

function ToggleJobListingStatusButton({
  id,
  status,
}: {
  id: string;
  status: JobListingStatus;
}) {
  const nextStatus = getNextJobListingStatus(status);
  const buttonText = JobListingStatusText(status);

  const button = (
    <ActionButton
      action={toggleJobListingStatus.bind(null, id)}
      variant={"outline"}
      requireAreYouSure={nextStatus === "published"}
      areYouSureDescription="This will immediately show this for all users"
    >
      {buttonText}
    </ActionButton>
  );
  const hasReachedMax = () => hasReachedMaxPublishedJobListings();
  const hasChangePermission = () =>
    hasOrgUserPermission("job_listing:change_status");

  return (
    <AsyncIf condition={hasChangePermission}>
      {nextStatus === "published" ? (
        <AsyncIf
          condition={hasReachedMax}
          otherwise={
            <UpgradePopover
              buttonText={buttonText}
              popoverText={
                " You must upgrade your plan to publish more job listings"
              }
            />
          }
        >
          {button}
        </AsyncIf>
      ) : (
        button
      )}
    </AsyncIf>
  );
}

function ToggleJobListingIsFeatureButton({
  id,
  isFeatured,
}: {
  id: string;
  isFeatured: boolean;
}) {
  const buttonText = JobListingSFeaturedText(isFeatured);

  const button = (
    <ActionButton
      action={toggleJobListingFeatured.bind(null, id)}
      variant={"outline"}
    >
      {buttonText}
    </ActionButton>
  );

  const hasReachedMax = () => hasReachedMaxFeaturedJobListings();
  const hasChangePermission = () =>
    hasOrgUserPermission("job_listing:change_status");

  return (
    <AsyncIf condition={hasChangePermission}>
      {!isFeatured ? (
        <AsyncIf
          condition={hasReachedMax}
          otherwise={
            <UpgradePopover
              buttonText={buttonText}
              popoverText={
                " You must upgrade your plan to feature more job listings"
              }
            />
          }
        >
          {button}
        </AsyncIf>
      ) : (
        button
      )}
    </AsyncIf>
  );
}

export async function getJobListing(id: string, orgId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, orgId)
    ),
  });
}

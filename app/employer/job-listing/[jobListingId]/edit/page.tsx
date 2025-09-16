import JobListingForm from "@/app/features/job-listings/components/job-listing-form";
import { getCurrentOrganaization } from "@/app/services/clerk/lib/get-current-auth";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getJobListing } from "../page";

type Props = {
  params: Promise<{ jobListingId: string }>;
};

export default function EditJobListingPage(props: Props) {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-2">Edit Job Listing</h1>
      <p className="mb-6 text-muted-foreground">
        This does not post the listing yet. It just saves a draft.
      </p>

      <Card>
        <CardContent>
          <Suspense>
            <SuspendedPage {...props} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function SuspendedPage({ params }: Props) {
  const { jobListingId } = await params;

  const { orgId } = await getCurrentOrganaization();

  if (orgId == null) {
    return notFound();
  }

  const jobListing = await getJobListing(jobListingId, orgId);

  if (jobListing == null) {
    return notFound();
  }

  return <JobListingForm jobListing={jobListing} />;
}

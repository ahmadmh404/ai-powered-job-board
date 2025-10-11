import { getGlobalTag, getIdlTag, getJobListingTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export function getJobListingApplicationsGlobalTag() {
  return getGlobalTag("job-listing-application");
}

export function getJobListingApplicationJobListingTag(jobListingId: string) {
  return getJobListingTag("job-listing-application", jobListingId);
}

export function getJobListingApplicationIdTag({
  jobListingId,
  userId,
}: {
  jobListingId: string;
  userId: string;
}) {
  return getIdlTag("job-listing-application", `${jobListingId}-${userId}`);
}

export function revalidateJobListingApplicationCache({
  jobListingId,
  userId,
}: {
  jobListingId: string;
  userId: string;
}) {
  revalidateTag(getJobListingApplicationsGlobalTag());
  revalidateTag(getJobListingApplicationJobListingTag(jobListingId));
  revalidateTag(getJobListingApplicationIdTag({ jobListingId, userId }));
}

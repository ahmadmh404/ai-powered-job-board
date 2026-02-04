import { getGlobalTag, getIdlTag, getOrganizationTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export function getJobListingGlobalTag() {
  return getGlobalTag("job-listing");
}

export function getJobListingOrganizationTag(organizationId: string) {
  return getOrganizationTag("job-listing", organizationId);
}

export function getJobListingIdTag(jobListingId: string) {
  return getIdlTag("job-listing", jobListingId);
}

export function revalidateJobListingCache({
  organizationId,
  jobListingId,
}: {
  organizationId: string;
  jobListingId: string;
}) {
  revalidateTag(getJobListingGlobalTag(), "max");
  revalidateTag(getJobListingOrganizationTag(organizationId), "max");
  revalidateTag(getJobListingIdTag(jobListingId), "max");
}

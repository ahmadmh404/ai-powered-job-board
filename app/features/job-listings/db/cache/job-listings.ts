// to make all the functions for user relted caching

import { getGlobalTag, getIdlTag, getOrganizationTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getJobListingGlobalTag = () => {
  return getGlobalTag("job-listing");
};

export const getJobListingOrganizationTag = (organizationId: string) => {
  return getOrganizationTag("job-listing", organizationId);
};

export const getJobListingIdTag = (jobListingId: string) => {
  return getIdlTag("job-listing", jobListingId);
};

// when i add or update or delete a user i will call this
export const revalidateJobListingCache = ({
  organizationId,
  jobListingId,
}: {
  organizationId: string;
  jobListingId: string;
}) => {
  // this revalidateTag is a nextjs build in functoin
  revalidateTag(getJobListingGlobalTag());
  getJobListingOrganizationTag(organizationId);
  revalidateTag(getJobListingIdTag(jobListingId));
};

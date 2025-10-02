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

export const revalidateJobListingCache = ({
  organizationId,
  jobListingId,
}: {
  organizationId: string;
  jobListingId: string;
}) => {
  // this revalidateTag is a nextjs build in functoin
  revalidateTag(getJobListingGlobalTag());
  revalidateTag(getJobListingOrganizationTag(organizationId));
  revalidateTag(getJobListingIdTag(jobListingId));
};

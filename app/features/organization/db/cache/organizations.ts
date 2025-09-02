// to make all the functions for user relted caching

import { getGlobalTag, getIdlTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getOrganizationGlobalTag = () => {
  return getGlobalTag("organaizations");
};

export const getOrganaizationIdTag = (orgId: string) => {
  return getIdlTag("organaizations", orgId);
};

// when i add or update or delete a user i will call this
export const revalidateOrganizatoinCache = (orgId: string) => {
  // this revalidateTag is a nextjs build in functoin
  revalidateTag(getOrganizationGlobalTag());
  revalidateTag(getOrganaizationIdTag(orgId));
};

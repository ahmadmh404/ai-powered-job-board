// to make all the functions for user entries caching

import { getGlobalTag, getIdlTag, getOrganizationTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getOrganizationGlobalTag = () => {
  return getGlobalTag("organizations");
};

export const getOrganizationIdTag = (orgId: string) => {
  return getIdlTag("organizations", orgId);
};

// when i add or update or delete a user i will call this
export const revalidateOrganizationCache = (orgId: string) => {
  // this revalidateTag is a nextjs build in functions
  revalidateTag(getOrganizationGlobalTag(), "max");
  revalidateTag(getOrganizationIdTag(orgId), "max");
};

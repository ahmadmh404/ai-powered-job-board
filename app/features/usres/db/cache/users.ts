// to make all the functions for user relted caching

import { getGlobalTag, getIdlTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getUserGlobalTag = () => {
  return getGlobalTag("users");
};

export const getUserIdTag = (id: string) => {
  return getIdlTag("users", id);
};

// when i add or update or delete a user i will call this
export const revalidateUserCache = (id: string) => {
  // this revalidateTag is a nextjs build in functoin
  revalidateTag(getUserGlobalTag());
  revalidateTag(getUserIdTag(id));
};

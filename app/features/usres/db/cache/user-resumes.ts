import { getGlobalTag, getIdlTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getUserResumeGlobalTAg = () => {
  return getGlobalTag("user-resume");
};

export const getUserResumeIdTAg = (userId: string) => {
  return getIdlTag("user-resume", userId);
};

export const revalidateUserCache = (id: string) => {
  revalidateTag(getUserResumeGlobalTAg());
  revalidateTag(getUserResumeIdTAg(id));
};

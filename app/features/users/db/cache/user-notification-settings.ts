// to make all the functions for user relted caching

import { getGlobalTag, getIdlTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getUserNotificationSettingsGlobalTag = () => {
  return getGlobalTag("user-notificatoin-settings");
};

export const getUserNotificationSettingsIdTag = (id: string) => {
  return getIdlTag("user-notificatoin-settings", id);
};

// when i add or update or delete a user i will call this
export const revalidateUserNotificationSettingsCache = (id: string) => {
  // this revalidateTag is a nextjs build in functoin
  revalidateTag(getUserNotificationSettingsGlobalTag());
  revalidateTag(getUserNotificationSettingsIdTag(id));
};

// to make all the functions for user relted caching

import { getGlobalTag, getIdlTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getUserNotificationSettingsGlobalTag = () => {
  return getGlobalTag("user-notification-settings");
};

export const getUserNotificationSettingsIdTag = (id: string) => {
  return getIdlTag("user-notification-settings", id);
};

// when i add or update or delete a user i will call this
export const revalidateUserNotificationSettingsCache = (id: string) => {
  // this revalidateTag is a nextjs build in function
  revalidateTag(getUserNotificationSettingsGlobalTag());
  revalidateTag(getUserNotificationSettingsIdTag(id));
};

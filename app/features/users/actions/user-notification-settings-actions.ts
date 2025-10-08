"use server";

import z from "zod";
import { UserNotificationSettingsSchema } from "./schemas";
import { getCurrentUser } from "@/app/services/clerk/lib/get-current-auth";
import { updateUserNotificationSettings as updateUserNotificationSettingsDB } from "../db/user-notification-settings";

export const updateUserNotificationSettings = async (
  unsafe: z.infer<typeof UserNotificationSettingsSchema>
) => {
  const error = {
    error: true,
    message: "there was an error updating your notification settings",
  };

  const { userId } = await getCurrentUser();

  if (userId == null) {
    return error;
  }

  const { success, data } = UserNotificationSettingsSchema.safeParse(unsafe);

  if (!success) {
    return error;
  }

  await updateUserNotificationSettingsDB(userId, { ...data });

  return {
    error: false,
    message: "Notification settings successfully updated",
  };
};

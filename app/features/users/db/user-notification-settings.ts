import { revalidateUserNotificationSettingsCache } from "@/app/features/users/db/cache/user-notification-settings";
import { db } from "@/drizzle/db";
import { UserNotificationSettingsTable } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";

export async function insertUserNotificationSettings(
  settings: typeof UserNotificationSettingsTable.$inferInsert
) {
  // What onConflictDonotUpdate does is that ignores any conflict requests.
  await db
    .insert(UserNotificationSettingsTable)
    .values(settings)
    .onConflictDoNothing();

  revalidateUserNotificationSettingsCache(settings.userId);
}

export async function updateUserNotificationSettings(
  userId: string,
  settings: Omit<typeof UserNotificationSettingsTable.$inferInsert, "userId">
) {
  await db
    .insert(UserNotificationSettingsTable)
    .values({ ...settings, userId })
    .onConflictDoUpdate({
      target: UserNotificationSettingsTable.userId,
      set: settings,
    });

  revalidateUserNotificationSettingsCache(userId);
}

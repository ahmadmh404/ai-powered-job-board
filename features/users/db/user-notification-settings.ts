import { revalidateUserNotificationSettingsCache } from "@/features/users/db/cache/user-notification-settings";
import { db } from "@/drizzle/db";
import { UserNotificationSettingsTable } from "@/drizzle/schemas";

export async function insertUserNotificationSettings(
  settings: typeof UserNotificationSettingsTable.$inferInsert
) {
  // What onConflictDoNotUpdate does is that ignores any conflict requests.
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

import { revalidateUserNotificationSettingsCache } from "@/app/features/users/db/cache/user-notification-settings";
import { db } from "@/drizzle/db";
import { UserNotificationSettingsTable } from "@/drizzle/schema";

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

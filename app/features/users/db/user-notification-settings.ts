import { revalidateUserNotificationSettingsCache } from "@/app/features/users/db/cache/user-notification-settings";
import { db } from "@/drizzle/db";
import { UserNotificationSettingsTable } from "@/drizzle/schema";
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
  data: Omit<typeof UserNotificationSettingsTable.$inferInsert, "userId">
) {
  await db
    .update(UserNotificationSettingsTable)
    .set(data)
    .where(eq(UserNotificationSettingsTable.userId, userId));

  revalidateUserNotificationSettingsCache(userId);
}

import { NotificationSettingsForm } from "@/features/users/components/notification-settings-form";
import { getUserNotificationSettingsIdTag } from "@/features/users/db/cache/user-notification-settings";
import { getCurrentUser } from "@/services/clerk/lib/get-current-auth";
import LoadingSpinner from "@/components/loading-sinner";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { UserNotificationSettingsTable } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default function NotificationsPage() {
  return (
    <Suspense>
      <SuspendedComponent />
    </Suspense>
  );
}

async function SuspendedComponent() {
  const { userId } = await getCurrentUser();

  if (userId == null) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 ">Notifications Settings</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <SuspendedForm userId={userId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function SuspendedForm({ userId }: { userId: string }) {
  const settings = await getNotificationSettings(userId);

  if (!settings)
    return <NotificationSettingsForm notificationSettings={settings} />;
}

async function getNotificationSettings(userId: string) {
  "use cache";
  cacheTag(getUserNotificationSettingsIdTag(userId));

  return db.query.UserNotificationSettingsTable.findFirst({
    where: eq(UserNotificationSettingsTable.userId, userId),
    columns: {
      newJobEmailNotifications: true,
      aiPrompt: true,
    },
  });
}

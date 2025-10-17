import { getUserNotificationSettingsIdTag } from "@/features/users/db/cache/user-notification-settings";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/get-current-auth";
import LoadingSpinner from "@/components/loading-sinner";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { OrganizationUserSettingsTable } from "@/drizzle/schemas";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NotificationSettingsForm } from "@/features/organization/components/notification-settings-form";
import { getOrganizationUserSettingsIdTag } from "@/features/organization/db/cache/organization-user-settings";

export default function EmployerUserSettingsPage() {
  return (
    <Suspense>
      <SuspendedComponent />
    </Suspense>
  );
}

async function SuspendedComponent() {
  const { userId } = await getCurrentUser();
  const { orgId } = await getCurrentOrganization();

  console.log("ids:", userId, orgId);

  if (userId == null || orgId == null) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 ">User Settings</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <SuspendedForm userId={userId} orgId={orgId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function SuspendedForm({
  userId,
  orgId,
}: {
  userId: string;
  orgId: string;
}) {
  const settings = await getOrganizationUserSettings(userId, orgId);

  return <NotificationSettingsForm notificationSettings={settings} />;
}

async function getOrganizationUserSettings(userId: string, orgId: string) {
  "use cache";
  cacheTag(
    getOrganizationUserSettingsIdTag({
      userId,
      organizationId: orgId,
    })
  );

  return db.query.OrganizationUserSettingsTable.findFirst({
    where: and(
      eq(OrganizationUserSettingsTable.userId, userId),
      eq(OrganizationUserSettingsTable.organizationId, orgId)
    ),
    columns: {
      newApplicationEmailNotifications: true,
      minimumRating: true,
    },
  });
}

import { db } from "@/drizzle/db";
import { OrganizationUserSettingsTable } from "@/drizzle/schemas";
import { revalidateOrganizationUserSettingsCache } from "./cache/organization-user-settings";
import { and, eq } from "drizzle-orm";

export async function insertOrganizationUserSettings(
  settings: typeof OrganizationUserSettingsTable.$inferInsert
) {
  await db
    .insert(OrganizationUserSettingsTable)
    .values(settings)
    .onConflictDoNothing({});

  revalidateOrganizationUserSettingsCache(settings);
}

export async function updateOrganizationUserSettings(
  userId: string,
  orgId: string,
  settings: Omit<
    typeof OrganizationUserSettingsTable.$inferInsert,
    "userId" | "organizationId"
  >
) {
  await db
    .insert(OrganizationUserSettingsTable)
    .values({ ...settings, userId, organizationId: orgId })
    .onConflictDoUpdate({
      target: [
        OrganizationUserSettingsTable.userId,
        OrganizationUserSettingsTable.organizationId,
      ],
      set: settings,
    });

  revalidateOrganizationUserSettingsCache({ userId, organizationId: orgId });
}

export async function deleteOrganizationUserSettings(
  settings: typeof OrganizationUserSettingsTable.$inferInsert
) {
  await db
    .delete(OrganizationUserSettingsTable)
    .where(
      and(
        eq(OrganizationUserSettingsTable.userId, settings.userId),
        eq(
          OrganizationUserSettingsTable.organizationId,
          settings.organizationId
        )
      )
    );

  revalidateOrganizationUserSettingsCache(settings);
}

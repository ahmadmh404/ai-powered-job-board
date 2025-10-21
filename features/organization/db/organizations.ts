import { db } from "@/drizzle/db";
import { OrganizationTable } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";
import { revalidateOrganizationCache } from "@/features/organization/db/cache/organizations";

export async function InsertOrganization(
  org: typeof OrganizationTable.$inferInsert
) {
  // What onConflictDoNotUpdate does is that ignores any conflict requests.
  await db.insert(OrganizationTable).values(org).onConflictDoNothing();

  revalidateOrganizationCache(org.id);
}

export async function updateOrganization(
  id: string,
  org: Partial<typeof OrganizationTable.$inferInsert>
) {
  // eq stands for === operator, two args, the table column and the value
  await db
    .update(OrganizationTable)
    .set(org)
    .where(eq(OrganizationTable.id, id));

  revalidateOrganizationCache(id);
}

export async function deleteOrganization(id: string) {
  await db.delete(OrganizationTable).where(eq(OrganizationTable.id, id));

  revalidateOrganizationCache(id);
}

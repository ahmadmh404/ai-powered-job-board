import { db } from "@/drizzle/db";
import { OrganizationTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateOrganizatoinCache } from "@/app/features/organization/db/cache/organizations";

export async function InsertOrganization(
  org: typeof OrganizationTable.$inferInsert
) {
  // What onConflictDonotUpdate does is that ignores any conflict requests.
  await db.insert(OrganizationTable).values(org).onConflictDoNothing();

  revalidateOrganizatoinCache(org.id);
}

export async function updateOrganization(
  id: string,
  org: Partial<typeof OrganizationTable.$inferInsert>
) {
  // eq stands for === operator, two args, the table column and the vlaue
  await db
    .update(OrganizationTable)
    .set(org)
    .where(eq(OrganizationTable.id, id));

  revalidateOrganizatoinCache(id);
}

export async function deleteOrganization(id: string) {
  await db.delete(OrganizationTable).where(eq(OrganizationTable.id, id));

  revalidateOrganizatoinCache(id);
}

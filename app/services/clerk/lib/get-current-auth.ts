import { db } from "@/drizzle/db";
import { OrganizationTable, UserTable } from "@/drizzle/schemas";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getUserIdTag } from "@/app//features/users/db/cache/users";
import { getOrganizationIdTag } from "@/app/features/organization/db/cache/organizations";

export async function getCurrentUser({ allData = false } = {}) {
  const { userId } = await auth();

  return {
    userId,
    user: allData && userId !== null ? await getUser(userId) : undefined,
  };
}

export async function getCurrentOrganization({ allData = false } = {}) {
  const { orgId } = await auth();

  return {
    orgId,
    organization:
      allData && orgId != null ? await getOrganization(orgId) : undefined,
  };
}

async function getUser(id: string) {
  "use cache";
  // as long as the user data is the same it will provide the cached versoin of the userDAta
  // if the user data changes then it will get the new user infor
  cacheTag(getUserIdTag(id));

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
}

async function getOrganization(orgId: string) {
  "use cache";
  // as long as the user data is the same it will provide the cached versoin of the userDAta
  // if the user data changes then it will get the new user infor
  cacheTag(getOrganizationIdTag(orgId));

  return db.query.OrganizationTable.findFirst({
    where: eq(OrganizationTable.id, orgId),
  });
}

import { db } from "@/drizzle/db";
import { OrganizationTable, UserTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getUserIdTag } from "@/app//features/usres/db/cache/users";
import { getOrganaizationIdTag } from "@/app/features/oranaizations/db/cache/organaizations";

export async function getCurrentUser({ allData = false } = {}) {
  const { userId } = await auth();

  return {
    userId,
    user: allData && userId !== null ? await getUser(userId) : undefined,
  };
}

export async function getCurrentOrganaization({ allData = false } = {}) {
  const { orgId } = await auth();

  return {
    orgId,
    organaization:
      allData && orgId != null ? await getOrganaization(orgId) : undefined,
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

async function getOrganaization(orgId: string) {
  "use cache";
  // as long as the user data is the same it will provide the cached versoin of the userDAta
  // if the user data changes then it will get the new user infor
  cacheTag(getOrganaizationIdTag(orgId));

  return db.query.OrganizationTable.findFirst({
    where: eq(OrganizationTable.id, orgId),
  });
}

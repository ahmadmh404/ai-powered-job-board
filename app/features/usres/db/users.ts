import { revalidateUserCache } from "@/app/features/usres/db/cache/users";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function InsertUser(user: typeof UserTable.$inferInsert) {
  // What onConflictDonotUpdate does is that ignores any conflict requests.
  await db.insert(UserTable).values(user).onConflictDoNothing();

  revalidateUserCache(user.id);
}

export async function updateUser(
  id: string,
  user: Partial<typeof UserTable.$inferInsert>
) {
  // eq stands for === operator, two args, the table column and the vlaue
  await db.update(UserTable).set(user).where(eq(UserTable.id, id));

  revalidateUserCache(id);
}

export async function deleteUser(id: string) {
  await db.delete(UserTable).where(eq(UserTable.id, id));

  revalidateUserCache(id);
}

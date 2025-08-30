import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";

export async function InsertUser(user: typeof UserTable.$inferInsert) {
  // What onConflictDonotUpdate does is that ignores any conflict requests.
  await db.insert(UserTable).values(user).onConflictDoNothing();
}

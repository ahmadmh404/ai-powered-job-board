import { db } from "@/drizzle/db";
import { UserResumeTable } from "@/drizzle/schema";
import { revalidateUserResumeCache } from "./cache/user-resumes";

export async function upsertUserResume(
  userId: string,
  data: Omit<typeof UserResumeTable.$inferInsert, "userId">
) {
  await db
    .insert(UserResumeTable)
    .values({ userId, ...data })
    .onConflictDoUpdate({
      target: UserResumeTable.userId,
      set: data,
    });

  revalidateUserResumeCache(userId);
}

export async function updateUserResume(
  userId: string,
  data: Partial<Omit<typeof UserResumeTable.$inferInsert, "userId">>
) {
  await db.update(UserResumeTable).set(data);

  revalidateUserResumeCache(userId);
}

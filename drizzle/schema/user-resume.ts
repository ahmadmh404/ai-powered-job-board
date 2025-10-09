import { pgTable, varchar } from "drizzle-orm/pg-core";

import { UserTable } from "@/drizzle/schemas";
import { createdAt, updatedAt } from "@/drizzle/schema-helpers";
import { relations } from "drizzle-orm";

export const UserResumeTable = pgTable("user_resumes", {
  userId: varchar()
    .primaryKey()
    .references(() => UserTable.id),
  resumeFileUrl: varchar().notNull(),

  // like the unique id is used for the file hosting system, it make us able to delete files when we upload new resume
  resumeFileKey: varchar().notNull(),

  // the ai generates the resume summary
  aiSummary: varchar(),
  createdAt,
  updatedAt,
});

export const UserResumeRelatinos = relations(UserResumeTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserResumeTable.userId],
    references: [UserTable.id],
  }),
}));

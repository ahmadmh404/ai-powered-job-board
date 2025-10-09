import { pgTable, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import {
  OrganaizationUserSettingsTable,
  UserNotificationSettingsTable,
  UserResumeTable,
} from "@/drizzle/schemas";
import { createdAt, updatedAt } from "@/drizzle/schema-helpers";

export const UserTable = pgTable("users", {
  id: varchar().primaryKey(),
  name: varchar().notNull(),
  // Clerk always return an image url
  imageUrl: varchar().notNull(),
  email: varchar().unique().notNull(),

  // imported from a file to avoide DRY
  createdAt,
  updatedAt,
});

export const UserReferences = relations(UserTable, ({ one, many }) => ({
  // herer we don't have a key pointing to other table so we don't specify the extra field and references.
  notificationSettings: one(UserNotificationSettingsTable),
  resume: one(UserResumeTable),
  organaizatoinUserSettings: many(OrganaizationUserSettingsTable),
}));

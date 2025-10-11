import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

import { OrganizationTable, UserTable } from "@/drizzle/schemas";
import { relations } from "drizzle-orm";
import { createdAt, updatedAt } from "../schema-helpers";

// used for the organization settings associated with a certain user
// like: do you want to receive an email when a user apply for you job application, and what are the minimum rating you wnat to setto determine if the applicant is okay iwth this job.
// in here the user may be in one or more organization so the primary key is a userId, organizationId companasion.
export const OrganizationUserSettingsTable = pgTable(
  "organization_user_settings",
  {
    id: varchar()
      .notNull()
      .references(() => UserTable.id),

    organizationId: varchar()
      .notNull()
      .references(() => OrganizationTable.id),

    newApplicationEmailNotifications: boolean().notNull().default(false),
    minimumRating: integer(),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.id, table.organizationId] })]
);

export const OrganizationUserSettingsReferences = relations(
  OrganizationUserSettingsTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [OrganizationUserSettingsTable.id],
      references: [UserTable.id],
    }),

    organization: one(OrganizationTable, {
      fields: [OrganizationUserSettingsTable.organizationId],
      references: [OrganizationTable.id],
    }),
  })
);

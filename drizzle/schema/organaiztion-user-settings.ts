import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

import { OrganizationTable, UserTable } from "@/drizzle/schema";
import { createdAt, updatedAt } from "@/drizzle/schema-helpers";
import { relations } from "drizzle-orm";

// used for the organaization settings associated with a certain user
// like: do you want to receive an email when a user apply for you job application, and what are the minimum rating you wnat to setto determine if the applicant is okay iwth this job.
// in here the user may be in one or more organaization so the primary key is a userId, organaizationId companasion.
export const OrganaizationUserSettingsTable = pgTable(
  "organaiztion_user_settings",
  {
    id: varchar()
      .notNull()
      .references(() => UserTable.id),
    organaizationId: varchar()
      .notNull()
      .references(() => OrganizationTable.id),

    newApplicationEmailNotifications: boolean().notNull().default(false),
    minimumRating: integer(),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.id, table.organaizationId] })]
);

export const OrganaizationUserSettingsReferences = relations(
  OrganaizationUserSettingsTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [OrganaizationUserSettingsTable.id],
      references: [UserTable.id],
    }),

    organaization: one(OrganizationTable, {
      fields: [OrganaizationUserSettingsTable.organaizationId],
      references: [OrganizationTable.id],
    }),
  })
);

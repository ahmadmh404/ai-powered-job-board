import { pgTable, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { createdAt, updatedAt } from "@/drizzle/schema-helpers";
import {
  JobListingTable,
  OrganizationUserSettingsTable,
} from "@/drizzle/schemas";

export const OrganizationTable = pgTable("organizations", {
  id: varchar().primaryKey(),
  name: varchar().notNull(),
  imageUrl: varchar(),
  createdAt,
  updatedAt,
});

export const OrganizationReferences = relations(
  OrganizationTable,
  ({ many }) => ({
    jobListings: many(JobListingTable),

    // for each job listing we have settings so we have many settings
    organizationSettings: many(OrganizationUserSettingsTable),
  }),
);

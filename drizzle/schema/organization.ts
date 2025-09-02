import { pgTable, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { createdAt, updatedAt } from "@/drizzle/schema-helpers";
import {
  JobListingTable,
  OrganaizationUserSettingsTable,
} from "@/drizzle/schema";

export const OrganizationTable = pgTable("organizatoins", {
  id: varchar().primaryKey(),
  name: varchar().notNull(),
  // Clerk always return an image url
  imageUrl: varchar(),

  // imported from a file to avoide DRY
  createdAt,
  updatedAt,
});

export const OrganaizationReferences = relations(
  OrganizationTable,
  ({ many }) => ({
    jobListings: many(JobListingTable),

    // for each job listing we have settings so we have many settings
    organaizationSettings: many(OrganaizationUserSettingsTable),
  })
);

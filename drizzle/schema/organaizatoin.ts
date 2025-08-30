import { pgTable, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { createdAt, updatedAt } from "@/drizzle/schema-helpers";
import {
  JobListingTable,
  OrganaizationUserSettingsTable,
} from "@/drizzle/schema";

export const OrganaizationTable = pgTable("organaizatoins", {
  id: varchar().primaryKey(),
  name: varchar().notNull(),
  // Clerk always return an image url
  imageUrl: varchar().notNull(),

  // imported from a file to avoide DRY
  createdAt,
  updatedAt,
});

export const OrganaizationReferences = relations(
  OrganaizationTable,
  ({ many }) => ({
    jobListings: many(JobListingTable),

    // for each job listing we have settings so we have many settings
    organaizationSettings: many(OrganaizationUserSettingsTable),
  })
);

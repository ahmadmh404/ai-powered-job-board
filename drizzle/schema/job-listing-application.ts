import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { JobListingTable, UserTable } from "@/drizzle/schema";

import { createdAt, updatedAt } from "@/drizzle/schema-helpers";
import { relations } from "drizzle-orm";

export const applicationStages = [
  "denied",
  "applied",
  "interested",
  "hired",
] as const;
export type ApplicationStage = (typeof applicationStages)[number];
export const ApplicatoinStageEnum = pgEnum(
  "job_listing_application_stage",
  applicationStages
);

export const JobLIstingApplicationTable = pgTable(
  "job_listing_applications",
  {
    jobListingId: uuid()
      .references(() => JobListingTable.id, {
        onDelete: "cascade",
      })
      .notNull(),

    userId: varchar()
      .references(() => UserTable.id, { onDelete: "cascade" })
      .notNull(),

    coverLetter: text(),
    rating: integer(),
    stage: ApplicatoinStageEnum().notNull().default("applied"),

    createdAt,
    updatedAt,
  },

  // make the id by joining the usreId and jobListingId
  (table) => [primaryKey({ columns: [table.jobListingId, table.userId] })]
);

// jon listing applicatoins relations
// one applicatoin is associatd with one user and one job listing
export const jobListingApplicationReferences = relations(
  JobLIstingApplicationTable,
  ({ one }) => ({
    jobListing: one(JobListingTable, {
      fields: [JobLIstingApplicationTable.jobListingId],
      references: [JobListingTable.id],
    }),
    user: one(UserTable, {
      fields: [JobLIstingApplicationTable.userId],
      references: [UserTable.id],
    }),
  })
);

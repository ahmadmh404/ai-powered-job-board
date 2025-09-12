import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "@/drizzle/schema-helpers";
import { OrganizationTable } from "./organization";
import { relations } from "drizzle-orm";
import { JobLIstingApplicationTable } from "./job-listing-application";

// wage intervals
export const wageIntervals = ["hourly", "yearly"] as const;
export type WageInterval = (typeof wageIntervals)[number];
export const WageIntervalEnum = pgEnum(
  "job_listing_wage_interval",
  wageIntervals
);

// location requirement
export const locationRequirements = ["in-office", "remote", "hybrid"] as const;
export type LocationRequirement = (typeof locationRequirements)[number];
export const LocationRequirementEnum = pgEnum(
  "job_listing_location_requirement",
  locationRequirements
);

// experience level
export const experienceLevels = ["junior", "mid-level", "senior"] as const;
export type ExperienceLevel = (typeof experienceLevels)[number];
export const ExperienceLevelEnum = pgEnum(
  "job_listing_experience_level",
  experienceLevels
);

// job listing status
export const jobListingStatus = ["draft", "published", "delisted"] as const;
export type JobListingStatus = (typeof jobListingStatus)[number];
export const JobListingStatusEnum = pgEnum(
  "job_listing_status",
  jobListingStatus
);

// job listing type
export const jobListingTypes = [
  "internship",
  "part-time",
  "full-time",
] as const;
export type JobListingType = (typeof jobListingTypes)[number];
export const JobListingEnum = pgEnum("job_listing_type", jobListingTypes);

export const JobListingTable = pgTable(
  "job_listings",
  {
    id,
    // foreign key from organaiztoin table
    organizationId: varchar()
      .references(() => OrganizationTable.id, {
        onDelete: "cascade",
      })
      .notNull(),

    title: varchar().notNull(),
    description: text().notNull(),

    wage: integer(),
    wageInterval: WageIntervalEnum(),
    city: varchar(),
    stateAbbreviation: varchar(),
    isFeatured: boolean().notNull().default(false),
    locationRequirement: LocationRequirementEnum().notNull(),
    experienceLevel: ExperienceLevelEnum().notNull(),
    status: JobListingStatusEnum().notNull().default("draft"),
    type: JobListingEnum().notNull(),

    // for when the job was posted
    postedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
  },

  // to search faster depending on state abreviatoin
  (table) => [index().on(table.stateAbbreviation)]
);

// relatoinss
export const jobListingReferences = relations(
  JobListingTable,
  ({ one, many }) => ({
    // every job listing is owned by an organaization
    organaization: one(OrganizationTable, {
      fields: [JobListingTable.organizationId],
      references: [OrganizationTable.id],
    }),

    // relation have neither fields nor references. This tells Typescript that applications is nullable:
    applications: many(JobLIstingApplicationTable),
  })
);

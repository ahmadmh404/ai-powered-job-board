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
import { OrganizationTable } from "./organaizatoin";
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
export type LocationRequirement = (typeof wageIntervals)[number];
export const LocationRequirementEnum = pgEnum(
  "job_listing_location_requirement",
  locationRequirements
);

// experience level
export const experienceLevels = ["junior", "mid-level", "senior"] as const;
export type ExperienceLevel = (typeof wageIntervals)[number];
export const ExperienceLevelEnum = pgEnum(
  "job_listing_experience_level",
  locationRequirements
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
    organaizationId: varchar()
      .references(() => OrganizationTable.id, {
        onDelete: "cascade",
      })
      .notNull(),

    title: varchar().notNull(),
    descriptoin: text().notNull(),

    wage: integer(),
    wageIntervalEnum: WageIntervalEnum(),
    city: varchar(),
    stateAbreviation: varchar(),
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
  (table) => [index().on(table.stateAbreviation)]
);

// relatoins

export const jobListingReferences = relations(
  JobListingTable,
  ({ one, many }) => ({
    // every job listing is owned by an organaization
    organaization: one(OrganizationTable, {
      fields: [JobListingTable.organaizationId],
      references: [OrganizationTable.id],
    }),

    // relation have neither fields nor references. This tells Typescript that applications is nullable:
    applications: many(JobLIstingApplicationTable),
  })
);

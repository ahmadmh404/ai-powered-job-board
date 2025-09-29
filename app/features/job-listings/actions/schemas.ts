import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema";
import z from "zod";

export const JobListingSchema = z
  .object({
    title: z.string().min(1, { error: "Requried" }),
    description: z.string().min(1, { error: "Requried" }),

    experienceLevel: z.enum(experienceLevels),
    locationRequirement: z.enum(locationRequirements),
    type: z.enum(jobListingTypes),

    wage: z.number().positive().min(1).nullable(),
    wageInterval: z.enum(wageIntervals).nullable(),

    stateAbbreviation: z
      .string()
      .transform((val) => (val === "" ? null : val))
      .nullable(),

    city: z
      .string()
      .transform((val) => (val === "" ? null : val))
      .nullable(),
  })
  .refine(
    (listing) => {
      return listing.locationRequirement === "remote" || listing.city != null;
    },
    {
      error: "Required for non-remote listing",
      path: ["city"],
    }
  )
  .refine(
    (listing) => {
      return (
        listing.locationRequirement === "remote" ||
        listing.stateAbbreviation != null
      );
    },
    {
      error: "Required for non-remote listing",
      path: ["stateAbbreviation"],
    }
  );

export const jobListingAISearchSchema = z.object({
  query: z.string().min(1, "Required"),
});

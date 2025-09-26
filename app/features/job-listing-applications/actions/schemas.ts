import z from "zod";

export const jobListingApplicationSchema = z.object({
  coverLetter: z
    .string()
    .transform((val) => (val.trim() === "" ? null : val))
    .nullable(),
});

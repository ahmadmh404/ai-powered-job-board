import { auth } from "@clerk/nextjs/server";

type Features =
  | "create_job_listings"
  | "post_1_job_listing"
  | "post_3_job_listings"
  | "post_15_job_listings"
  | "1_featured_job_listing"
  | "unlimited_featured_job_listings"
  | "manage_applicant_workflow";

export async function hasPlanFeature(feature: Features) {
  const { has } = await auth();
  return has({ feature });
}

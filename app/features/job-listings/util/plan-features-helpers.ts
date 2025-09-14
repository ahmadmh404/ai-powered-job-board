import { getCurrentOrganaization } from "@/app/services/clerk/lib/get-current-auth";
import { hasPlanFeature } from "@/app/services/clerk/lib/plan-features";
import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { and, count, eq } from "drizzle-orm";

export async function hasReachedMaxFeatredJobListings() {
  const { orgId } = await getCurrentOrganaization();

  if (orgId == null) {
    return true;
  }

  const count = await getOrgPublishedJobListingsCount(orgId);

  const canPost = await Promise.all([
    hasPlanFeature("post_1_job_listing").then((has) => has && count < 1),
    hasPlanFeature("post_1_job_listing").then((has) => has && count < 3),
    hasPlanFeature("post_15_job_listings").then((has) => has && count < 15),
  ]);

  return canPost.some(Boolean);
}

async function getOrgPublishedJobListingsCount(orgId: string) {
  const [res] = await db
    .select({
      count: count(),
    })
    .from(JobListingTable)
    .where(
      and(
        eq(JobListingTable.organizationId, orgId),
        eq(JobListingTable.status, "published")
      )
    );

  return res.count ?? 0;
}

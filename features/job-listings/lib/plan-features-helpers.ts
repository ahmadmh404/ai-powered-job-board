import { getCurrentOrganization } from "@/services/clerk/lib/get-current-auth";
import { hasPlanFeature } from "@/services/clerk/lib/plan-features";
import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schemas";
import { and, count, eq } from "drizzle-orm";

export async function hasReachedMaxPublishedJobListings() {
  const { orgId } = await getCurrentOrganization();

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

export async function hasReachedMaxFeaturedJobListings() {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null) {
    return true;
  }

  const count = await getOrgFeaturedJobListingsCount(orgId);

  const canFeature = await Promise.all([
    hasPlanFeature("1_featured_job_listing").then((has) => has && count < 1),
    hasPlanFeature("unlimited_featured_job_listings"),
  ]);

  return canFeature.some(Boolean);
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

export async function getOrgFeaturedJobListingsCount(orgId: string) {
  const [res] = await db
    .select({
      count: count(),
    })
    .from(JobListingTable)
    .where(
      and(
        eq(JobListingTable.organizationId, orgId),
        eq(JobListingTable.isFeatured, true)
      )
    );

  return res.count ?? 0;
}

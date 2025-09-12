import { auth } from "@clerk/nextjs/server";

type OrgUserPermissions =
  | "job_listing:create"
  | "job_listing:update"
  | "job_listing:delete"
  | "job_listing:change_status"
  | "job_listing_application:change_rating"
  | "job_listing_application:change_stage";

export async function hasOrgUserPermissoin(permission: OrgUserPermissions) {
  const { has } = await auth();
  return has({ permission });
}

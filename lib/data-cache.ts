// type for the cache tags, meaning users cached tag, organizations cache tag, ...
type CacheTag =
  | "users"
  | "organizations"
  | "job-listing"
  | "user-notification-settings"
  | "job-listing-application"
  | "user-resume"
  | "organization-user-settings";

// util to get the tag as string
// when i add, update, delete, any record i need to get the key related to the cached data to update it.
export function getGlobalTag(tag: CacheTag) {
  return `global:${tag}` as const;
}

// this is an organization level caching, like caching a specific organization job listing.
export function getOrganizationTag(tag: CacheTag, organizationId: string) {
  return `organization:${organizationId}-${tag}` as const;
}

// for job listing related caches, like applications
export function getJobListingTag(tag: CacheTag, jobListingId: string) {
  return `job-listing:${jobListingId}-${tag}` as const;
}

// the narrow caching, is when i wanna to cache a specific record with a specific id
// like when a certain user with a specific id changes i wanna to refetch the cache related to that user.
export function getIdlTag(tag: CacheTag, id: string) {
  return `id:${id}-${tag}` as const;
}

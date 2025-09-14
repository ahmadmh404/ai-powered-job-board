import { JobListingStatus } from "@/drizzle/schema";

export function getNextJobListingStatus(status: JobListingStatus) {
  switch (status) {
    case "delisted":
    case "draft":
      return "published";

    case "published":
      return "delisted";
    default:
      throw new Error(`Invalid job listing ${status satisfies never}`);
  }
}

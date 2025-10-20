import { ApplicationStage } from "@/drizzle/schemas";

export function formatJobListingApplicationStage(stage: ApplicationStage) {
  switch (stage) {
    case "applied":
      return "Applied";
    case "interested":
      return "Interested";
    case "interviewed":
      return "Interviewed";
    case "hired":
      return "Hired";
    case "denied":
      return "Denied";
    default:
      throw new Error(`Invalid job listing ${stage satisfies never}`);
  }
}

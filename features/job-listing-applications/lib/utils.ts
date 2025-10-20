import { ApplicationStage } from "@/drizzle/schemas";

export function sortApplicationByStage(
  a: ApplicationStage,
  b: ApplicationStage
) {
  return (
    APPLICATION_STAGE_SORTING_ORDER[a] - APPLICATION_STAGE_SORTING_ORDER[b]
  );
}

const APPLICATION_STAGE_SORTING_ORDER: Record<ApplicationStage, number> = {
  applied: 0,
  interested: 1,
  interviewed: 2,
  hired: 3,
  denied: 4,
};

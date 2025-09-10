import { Badge } from "@/components/ui/badge";
import { JobListingTable } from "@/drizzle/schema";
import { ComponentProps } from "react";
import { formatWage } from "../util/formators";

export default function JobListingBadges({
  jobListing: {
    city,
    type,
    wage,
    wageInterva,
    experienceLevel,
    isFeatured,
    stateAbreviation,
    locationRequirement,
  },
  className = "",
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferInsert,
    | "city"
    | "type"
    | "wage"
    | "wageInterva"
    | "experienceLevel"
    | "isFeatured"
    | "stateAbreviation"
    | "locationRequirement"
  >;
  className?: string;
}) {
  const badgeProps = {
    variant: "outline",
    className,
  } satisfies ComponentProps<typeof Badge>;

  return (
    <>
      {wage != null && wageInterva != null && (
        <Badge {...badgeProps}>{formatWage(wage, wageInterva)}</Badge>
      )}
    </>
  );
}

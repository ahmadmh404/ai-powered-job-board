import { Badge } from "@/components/ui/badge";
import { JobListingTable } from "@/drizzle/schema";
import { ComponentProps } from "react";
import {
  formatExperienceLevel,
  formatJobListingLocation,
  formatJobType,
  formatLocationRequirments,
  formatWage,
} from "../util/formators";
import {
  BanknoteIcon,
  BuildingIcon,
  GraduationCapIcon,
  HourglassIcon,
  MapPinIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function JobListingBadges({
  jobListing: {
    city,
    type,
    wage,
    wageInterval,
    experienceLevel,
    isFeatured,
    stateAbbreviation,
    locationRequirement,
  },
  className = "",
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferInsert,
    | "city"
    | "type"
    | "wage"
    | "wageInterval"
    | "experienceLevel"
    | "isFeatured"
    | "stateAbbreviation"
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
      {isFeatured && (
        <Badge
          {...badgeProps}
          className={cn(
            className,
            "border-featured bg-featured/50 text-featured-foregroundound"
          )}
        >
          Featured
        </Badge>
      )}

      {wage != null && wageInterval != null && (
        <Badge {...badgeProps}>
          <BanknoteIcon />
          {formatWage(wage, wageInterval)}
        </Badge>
      )}

      {(stateAbbreviation != null || city != null) && (
        <Badge {...badgeProps}>
          <MapPinIcon />
          {formatJobListingLocation({ city, stateAbbreviation })}
        </Badge>
      )}

      <Badge {...badgeProps}>
        <BuildingIcon />
        {formatLocationRequirments(locationRequirement)}
      </Badge>

      <Badge {...badgeProps}>
        <HourglassIcon />
        {formatJobType(type)}
      </Badge>

      <Badge {...badgeProps}>
        <GraduationCapIcon />
        {formatExperienceLevel(experienceLevel)}
      </Badge>
    </>
  );
}

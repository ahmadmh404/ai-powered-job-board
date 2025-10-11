import {
  ExperienceLevel,
  JobListingStatus,
  JobListingType,
  LocationRequirement,
  WageInterval,
} from "@/drizzle/schemas";

export const formatWageIntervals = (interval: WageInterval) => {
  switch (interval) {
    case "hourly":
      return "Hour";

    case "yearly":
      return "Year";

    default:
      throw new Error(`Invalid Wage Interval ${interval satisfies never}`);
  }
};

export const formatLocationRequirements = (
  locationRequirement: LocationRequirement
) => {
  switch (locationRequirement) {
    case "remote":
      return "Remote";

    case "in-office":
      return "In Office";

    case "hybrid":
      return "Hybrid";

    default:
      throw new Error(
        `Invalid Location Requirement ${locationRequirement satisfies never}`
      );
  }
};

export const formatJobType = (type: JobListingType) => {
  switch (type) {
    case "full-time":
      return "Full Time";

    case "part-time":
      return "Part TIme";

    case "internship":
      return "Internship";

    default:
      throw new Error(`Invalid Location Requirement ${type satisfies never}`);
  }
};

export const formatExperienceLevel = (level: ExperienceLevel) => {
  switch (level) {
    case "junior":
      return "Junior";

    case "mid-level":
      return "Mid Level";

    case "senior":
      return "Senior";

    default:
      throw new Error(`Invalid Location Requirement ${level satisfies never}`);
  }
};

export function formatJobListingStatus(status: JobListingStatus) {
  switch (status) {
    case "published":
      return "Active";

    case "draft":
      return "Draft";

    case "delisted":
      return "Delisted";

    default:
      throw new Error(`Invalid Location Requirement ${status satisfies never}`);
  }
}

export function formatWage(wage: number, wageInterval: WageInterval) {
  const wageFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  switch (wageInterval) {
    case "hourly":
      return `${wageFormatter.format(wage)} / hr`;
    case "yearly":
      return wageFormatter.format(wage);

    default:
      throw new Error(`Unknown wage interval ${wageInterval satisfies never}`);
  }
}

export function formatJobListingLocation({
  city,
  stateAbbreviation,
}: {
  city: string | null;
  stateAbbreviation: string | null;
}) {
  if (city == null && stateAbbreviation == null) return "None";

  const locationParts = [] as string[];

  if (city != null) locationParts.push(city);
  if (stateAbbreviation != null)
    locationParts.push(stateAbbreviation.toUpperCase());

  return locationParts.join(", ");
}

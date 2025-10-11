import {
  Button,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import tailwindConfig from "@/services/resend/data/tailwind-config";
import { JobListingTable } from "@/drizzle/schemas";
import {
  formatExperienceLevel,
  formatJobListingLocation,
  formatJobType,
  formatLocationRequirements,
  formatWage,
} from "@/features/job-listings/lib/formatters";

type JobListing = Pick<
  typeof JobListingTable.$inferSelect,
  | "id"
  | "city"
  | "title"
  | "title"
  | "stateAbbreviation"
  | "locationRequirement"
  | "experienceLevel"
  | "type"
  | "wage"
  | "wageInterval"
> & {
  organizationName: string;
};

export default function DailyJobListingEmail({
  userName,
  jobListings,
  serverUrl,
}: {
  userName: string;
  jobListings: JobListing[];
  serverUrl: string;
}) {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Container className="font-sans">
          <Heading as="h1">New Job Listings</Heading>
          <Text>
            Hello {userName}, Here are all the job listings that meet your
            criteria
          </Text>
          <Section>
            {jobListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-card text-card-foreground rounded-lg border border-solid border-primary p-4 mb-6"
              >
                <Text className="leading-none text-xl font-semibold my-0">
                  {listing.title}
                </Text>

                <Text className="text-muted-foreground mb-2 mt-0">
                  {listing.organizationName}
                </Text>

                <div className="mb-5">
                  {getJobBadges(listing).map((badge, index) => (
                    <div
                      key={index}
                      className="inline-block rounded-md border-solid border font-medium w-fit tex-foreground text-sm  px-3 py-1 mb-1 mr-1"
                    >
                      {badge}
                    </div>
                  ))}
                </div>

                <Button
                  href={`${serverUrl}?job-listing=${listing.id}`}
                  className="rounded-md text-sm font-medium bg-primary text-primary-foreground px-4 py-2 focus-visible:border-ring"
                >
                  View Details
                </Button>
              </div>
            ))}
          </Section>
        </Container>
      </Html>
    </Tailwind>
  );
}

function getJobBadges(jobListing: JobListing) {
  const jobBadges = [
    formatLocationRequirements(jobListing.locationRequirement),
    formatJobType(jobListing.type),
    formatExperienceLevel(jobListing.experienceLevel),
  ];

  if (jobListing.city != null || jobListing.stateAbbreviation != null) {
    jobBadges.unshift(
      formatJobListingLocation({
        city: jobListing.city,
        stateAbbreviation: jobListing.stateAbbreviation,
      })
    );
  }

  if (jobListing.wage != null && jobListing.wageInterval != null) {
    jobBadges.unshift(formatWage(jobListing.wage, jobListing.wageInterval));
  }

  return jobBadges;
}

DailyJobListingEmail.PreviewProps = {
  userName: "Ahmad Hossamo",
  jobListings: [
    {
      city: "Omaha",
      stateAbbreviation: "NE",
      title: "Frontend Developer",
      wage: null,
      wageInterval: null,
      experienceLevel: "senior",
      type: "part-time",
      id: crypto.randomUUID(),
      organizationName: "Web Dev Simplified",
      locationRequirement: "in-office",
    },
    {
      city: null,
      stateAbbreviation: null,
      title: "Software Engineer",
      wage: 100000,
      wageInterval: "yearly",
      experienceLevel: "mid-level",
      type: "full-time",
      id: crypto.randomUUID(),
      organizationName: "Google",
      locationRequirement: "remote",
    },
  ],
  serverUrl: "http://localhost:3000",
} satisfies Parameters<typeof DailyJobListingEmail>[0];

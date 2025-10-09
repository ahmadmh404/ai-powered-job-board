import { Container, Html, Tailwind } from "@react-email/components";
import tailwindConfig from "@/app/services/resend/data/tailwind-config";
import { JobListingTable } from "@/drizzle/schemas";

type JobListing = Pick<
  typeof JobListingTable.$inferSelect,
  | "id"
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
        <Container className="font-sans"></Container>
      </Html>
    </Tailwind>
  );
}

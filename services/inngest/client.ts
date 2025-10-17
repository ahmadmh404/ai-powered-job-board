import { JobLIstingApplicationTable, JobListingTable } from "@/drizzle/schemas";
import {
  DeletedObjectJSON,
  OrganizationJSON,
  OrganizationMembershipJSON,
  UserJSON,
} from "@clerk/nextjs/server";
import { EventSchemas, Inngest } from "inngest";

type ClerkWebHookData<T> = {
  data: {
    data: T;
    headers: Record<string, string>;
    raw: string;
  };
};

type Events = {
  "Clerk/user.created": ClerkWebHookData<UserJSON>;
  "Clerk/user.updated": ClerkWebHookData<UserJSON>;
  "Clerk/user.deleted": ClerkWebHookData<DeletedObjectJSON>;

  "Clerk/organization.created": ClerkWebHookData<OrganizationJSON>;
  "Clerk/organization.updated": ClerkWebHookData<OrganizationJSON>;
  "Clerk/organization.deleted": ClerkWebHookData<DeletedObjectJSON>;

  "Clerk/organization-user-settings.created": ClerkWebHookData<OrganizationMembershipJSON>;
  "Clerk/organization-user-settings.deleted": ClerkWebHookData<OrganizationMembershipJSON>;

  "App/job-listing-application.created": {
    data: { jobListingId: string; userId: string };
  };

  "App/resume.uploaded": {
    user: { id: string };
  };

  "app/email.daily-user-job-listing-notifications": {
    data: {
      aiPrompt?: string;
      jobListings: (Omit<
        typeof JobListingTable.$inferSelect,
        "createdAt" | "updatedAt" | "status" | "organizationId" | "postedAt"
      > & { organizationName: string })[];
    };
    user: {
      email: string;
      name: string;
    };
  };

  "app/email.daily-organization-user-applications": {
    data: {
      applications: (Pick<
        typeof JobLIstingApplicationTable.$inferSelect,
        "rating"
      > & {
        userName: string;
        organizationId: string;
        organizationName: string;
        jobListingId: string;
        jobListingTitle: string;
      })[];
    };
    user: {
      name: string;
      email: string;
    };
  };
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "job-board-spn",
  schemas: new EventSchemas().fromRecord<Events>(),
});

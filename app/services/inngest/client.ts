import {
  DeletedObjectJSON,
  OrganizationJSON,
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

  "App/job-listing-application.created": {
    data: { jobListingId: string; userId: string };
  };

  "App/resume.uploaded": {
    user: { id: string };
  };
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "job-board-spn",
  schemas: new EventSchemas().fromRecord<Events>(),
});

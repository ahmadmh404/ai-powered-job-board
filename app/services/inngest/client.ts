import { DeletedObjectJSON, UserJSON } from "@clerk/nextjs/server";
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
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "job-borad-spn",
  schemas: new EventSchemas().fromRecord<Events>(),
});

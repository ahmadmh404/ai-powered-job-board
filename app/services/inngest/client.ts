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
  "clerk/user.created": ClerkWebHookData<UserJSON>;
  "clerk/user.updated": ClerkWebHookData<UserJSON>;
  "clerk/user.deleted": ClerkWebHookData<DeletedObjectJSON>;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "job-borad-spn",
  schemas: new EventSchemas().fromRecord<Events>(),
});

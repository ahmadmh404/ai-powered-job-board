import { env } from "@/data/env/server";
import { inngest } from "@/app/services/inngest/client";

import { Webhook } from "svix";
import { NonRetriableError } from "inngest";
import {
  deleteUser,
  InsertUser,
  updateUser,
} from "@/app/features/usres/db/users";
import { insertUserNotificationSettings } from "@/app/features/usres/db/user-notification-settings";
import { UserTable } from "@/drizzle/schema";

// verify teh webhook validaty
function validateWebhook({
  raw,
  headers,
}: {
  raw: string;
  headers: Record<string, string>;
}) {
  return new Webhook(env.CLERK_WEBHOOK_SECRET).verify(raw, headers);
}

// when user is created inngest call this function
export const clerkCreateUser = inngest.createFunction(
  {
    id: "clerk/create-db-user",
    name: "Clerk - Create DB User",
  },
  { event: "Clerk/user.created" },
  async ({ event, step }) => {
    // step 1: verify the webhook
    // steps are used to run retries from where a task stopped the last time it ran.
    await step.run("verify-webhook", async () => {
      try {
        validateWebhook(event.data);
      } catch {
        // this fancy function says 'don't buther yourself this step woill never success.
        throw new NonRetriableError("Invalid webhook");
      }
    });

    // step 2: insert the user in the DB
    const userId = await step.run("insert-user", async () => {
      const userData = event.data.data;

      const email = userData.email_addresses.find(
        (email) => email.id === userData.primary_email_address_id
      );

      if (email === null) {
        throw new NonRetriableError("No primary email address found");
      }

      await InsertUser({
        id: userData.id,
        imageUrl: userData.image_url,
        name: `${userData.first_name} ${userData.last_name}`,
        email: email?.email_address,
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(userData.updated_at),
      });

      return userData.id;
    });

    // step 3: create user notification settings
    await step.run("create-user-notification-settings", async () => {
      await insertUserNotificationSettings({ userId });
    });
  }
);

// clerk update user
export const clerkUpdateUser = inngest.createFunction(
  {
    id: "clerk/update-db-user",
    name: "Clerk - Update DB User",
  },
  { event: "Clerk/user.updated" },
  async ({ event, step }) => {
    // step 1
    await step.run("verify-webhook", async () => {
      try {
        await validateWebhook(event.data);
      } catch {
        throw new NonRetriableError("Invalid webhook");
      }
    });

    // step 2: udpate the user
    await step.run("update-user", async () => {
      const userData = event.data.data;

      const email = userData.email_addresses.find(
        (email) => email.id === userData.primary_email_address_id
      );

      if (email == null) {
        throw new NonRetriableError("No primary email address found");
      }

      // step 3:
      await updateUser(userData.id, {
        name: `${userData.first_name} ${userData.last_name}`,
        imageUrl: userData.image_url,
        email: email.email_address,
        updatedAt: new Date(userData.updated_at),
      });
    });
  }
);

// clerk delete user
export const clerkDeleteUser = inngest.createFunction(
  {
    id: "clerk/delete-db-user",
    name: "Clerk - Delete DB User",
  },
  { event: "Clerk/user.deleted" },
  async ({ event, step }) => {
    // step 1
    await step.run("verify-webhook", async () => {
      try {
        await validateWebhook(event.data);
      } catch {
        throw new NonRetriableError("Invalid webhook");
      }
    });

    // step 2: udpate the user
    await step.run("delete-user", async () => {
      const { id } = event.data.data;

      if (id == null) {
        throw new NonRetriableError("No id found");
      }

      await deleteUser(id);
    });
  }
);

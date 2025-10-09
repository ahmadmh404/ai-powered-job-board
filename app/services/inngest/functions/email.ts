import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { and, eq } from "drizzle-orm";

import { subDays } from "date-fns";
import { GetEvents } from "inngest";
import { getMatchingJobListing } from "../ai/get-matchingjob-listings";
import { resend } from "../../resend/client";
import DailyJobListingEmail from "../../resend/components/daily-job-listing-email";
import {
  JobListingTable,
  UserNotificationSettingsTable,
} from "@/drizzle/schemas";

export const properDailyUserJobListingNotifications = inngest.createFunction(
  {
    id: "proper-daily-user-job-listing-notification",
    name: "Proper Daily User Job Listing Notifications",
  },
  {
    cron: "0 7 * * * *",
  },
  async ({ step, event }) => {
    const allUsers = step.run("get-all-users", async () => {
      return await db.query.UserNotificationSettingsTable.findMany({
        where: eq(UserNotificationSettingsTable.newJobEmailNotifications, true),
        columns: {
          userId: true,
          newJobEmailNotifications: true,
          aiPrompt: true,
        },
        with: {
          user: {
            columns: {
              email: true,
              name: true,
            },
          },
        },
      });
    });

    const recentListings = step.run("get-all-recent-listings", async () => {
      return await db.query.JobListingTable.findMany({
        where: and(
          eq(JobListingTable.status, "published"),
          eq(
            JobListingTable.postedAt,
            subDays(new Date(event?.ts ?? new Date()), 1)
          )
        ),
        columns: {
          createdAt: false,
          updatedAt: false,
          status: false,
          organizationId: false,
          postedAt: false,
        },
        with: {
          organization: { columns: { name: true } },
        },
      });
    });

    const [usersNotifications, jobListings] = await Promise.all([
      allUsers,
      recentListings,
    ]);

    if (usersNotifications == null || jobListings == null) return;

    const events = usersNotifications.map((notification) => {
      return {
        name: "app/email.daily-user-job-listing-notifications",
        data: {
          aiPrompt: notification.aiPrompt ?? undefined,
          jobListings: jobListings.map((listing) => ({
            ...listing,
            organizationName: listing.organization.name,
          })),
        },
        user: {
          email: notification.user.email,
          name: notification.user.name,
        },
      } as const satisfies GetEvents<
        typeof inngest
      >["app/email.daily-user-job-listing-notifications"];
    });

    step.sendEvent("send-emails", events);
  }
);

export const sendDailyUserJobListingEmail = inngest.createFunction(
  {
    id: "send-daily-user-job-listing-email",
    name: "Send User Job Listing Email",
  },
  {
    event: "app/email.daily-user-job-listing-notifications",
  },
  async ({ step, event }) => {
    const { name, email } = event.user;
    const { aiPrompt, jobListings } = event.data;

    if (jobListings.length === 0) return;

    let matchingJobListings: typeof jobListings = [];

    if (aiPrompt == null || aiPrompt.trim() == null) {
      matchingJobListings = jobListings;
    } else {
      const matchingIds = await getMatchingJobListing({
        prompt: aiPrompt,
        jobListings,
      });

      matchingJobListings = jobListings.filter((listing) =>
        matchingIds.includes(listing.id)
      );
    }

    if (matchingJobListings.length === 0) return;

    await step.run("send-email", async () => {
      await resend.emails.send({
        from: "linkedlist590@gmail.com",
        to: email,
        subject: "Daily Job Listings",
        react: DailyJobListingEmail({
          userName: name,
          jobListings: matchingJobListings,
          serverUrl: "http://localhost:3000",
        }),
      });
    });
  }
);

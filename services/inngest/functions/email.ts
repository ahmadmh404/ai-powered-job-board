import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { and, eq, gte } from "drizzle-orm";

import { subDays } from "date-fns";
import { GetEvents } from "inngest";
import { resend } from "../../resend/client";
import DailyJobListingEmail from "../../resend/components/daily-job-listing-email";
import {
  JobLIstingApplicationTable,
  JobListingTable,
  OrganizationUserSettingsTable,
  UserNotificationSettingsTable,
} from "@/drizzle/schemas";
import { env } from "@/data/env/server";
import { getMatchingJobListing } from "../ai/get-matching-job-listings";
import DailyApplicationEmail from "../../resend/components/daily-applications-email";

export const properDailyUserJobListingNotifications = inngest.createFunction(
  {
    id: "proper-daily-user-job-listing-notification",
    name: "Proper Daily User Job Listing Notifications",
  },
  {
    cron: "TZ=America/Chicago 0 7 * * *",
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
          gte(
            JobListingTable.postedAt,
            subDays(new Date(event?.ts ?? Date.now()), 1)
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

    if (usersNotifications.length === 0 || jobListings.length == -0) return;

    const events = usersNotifications.map((notification) => {
      return {
        name: "app/email.daily-user-job-listing-notifications",
        user: {
          email: notification.user.email,
          name: notification.user.name,
        },
        data: {
          aiPrompt: notification.aiPrompt ?? undefined,
          jobListings: jobListings.map((listing) => {
            return {
              ...listing,
              organizationName: listing.organization.name,
            };
          }),
        },
      } as const satisfies GetEvents<
        typeof inngest
      >["app/email.daily-user-job-listing-notifications"];
    });

    await step.sendEvent("send-emails", events);
  }
);

export const sendDailyUserJobListingEmail = inngest.createFunction(
  {
    id: "send-daily-user-job-listing-email",
    name: "Send User Job Listing Email",
    throttle: {
      limit: 10,
      period: "1m",
    },
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
    console.log("user info: ", name, email);

    if (matchingJobListings.length === 0) return;

    await step.run("send-email", async () => {
      await resend.emails.send({
        from: "Job Board <onboarding@resend.dev>",
        to: email,
        subject: "Daily Job Listings",
        react: DailyJobListingEmail({
          userName: name,
          jobListings: matchingJobListings,
          serverUrl: env.SERVER_URL,
        }),
      });

      console.log("Email was sent");
    });
  }
);

export const prepareDailyOrganizationUsrApplicationNotifications =
  inngest.createFunction(
    {
      id: "prepare-daily-organization-application-notifications",
      name: "Prepare Daily Organization User Application Notifications",
    },
    {
      cron: "TZ=America/Chicago 0 7 * * *",
    },
    async ({ event, step }) => {
      // get all users with notifications enabled
      const getUsers = step.run("get-users", async () => {
        return await db.query.OrganizationUserSettingsTable.findMany({
          where: eq(
            OrganizationUserSettingsTable.newApplicationEmailNotifications,
            true
          ),
          columns: {
            userId: true,
            organizationId: true,
            newApplicationEmailNotifications: true,
            minimumRating: true,
          },
          with: { user: { columns: { name: true, email: true } } },
        });
      });

      // get recent applications
      const getApplications = step.run("get-recent-applications", async () => {
        return await db.query.JobLIstingApplicationTable.findMany({
          where: gte(
            JobLIstingApplicationTable.createdAt,
            subDays(new Date(event?.ts ?? Date.now()), 1)
          ),
          columns: {
            rating: true,
          },
          with: {
            user: { columns: { name: true } },
            jobListing: {
              columns: { id: true, title: true },
              with: { organization: { columns: { id: true, name: true } } },
            },
          },
        });
      });

      // get the data
      const [userNotifications, applications] = await Promise.all([
        getUsers,
        getApplications,
      ]);

      console.log("applications: ", userNotifications, applications);

      // checks
      if (userNotifications.length === 0 || applications.length === 0) return;

      // group the notifications by userId
      const groupedUserNotifications = Object.groupBy(
        userNotifications,
        (u) => u.userId
      );

      // get events data
      const events = Object.values(groupedUserNotifications)
        .map((settings) => {
          if (settings == null || settings.length === 0) return null;

          // the person we are sending the email to
          const userName = settings[0].user.name;
          const userEmail = settings[0].user.email;

          // filter applications
          const filteredApplications = applications
            .filter((a) => {
              return settings.find((s) => {
                return (
                  a.jobListing.organization.id === s.organizationId &&
                  (s.minimumRating == null ||
                    s.minimumRating <= (a.rating ?? 0))
                );
              });
            })
            .map((a) => ({
              organizationId: a.jobListing.organization.id,
              organizationName: a.jobListing.organization.name,
              jobListingId: a.jobListing.id,
              jobListingTitle: a.jobListing.title,
              userName: a.user.name,
              rating: a.rating,
            }));

          if (filteredApplications.length === 0) return null;

          return {
            name: "app/email.daily-organization-user-applications",
            user: {
              name: userName,
              email: userEmail,
            },
            data: {
              applications: filteredApplications,
            },
          } as const satisfies GetEvents<
            typeof inngest
          >["app/email.daily-organization-user-applications"];
        })
        .filter((e) => e != null);

      // activate the events
      await step.sendEvent("send-emails", events);
    }
  );

export const sendDailyOrganizationUserApplicationEmails =
  inngest.createFunction(
    {
      id: "send-daily-organization-user-application-email",
      name: "Send Daily Organization User Application Emails",
      throttle: {
        limit: 100,
        period: "1m",
      },
    },
    {
      event: "app/email.daily-organization-user-applications",
    },
    async ({ event, step }) => {
      const applications = event.data.applications;
      const user = event.user;

      if (applications == null || applications.length === 0) return;

      await step.run("send-emails", async () => {
        await resend.emails.send({
          from: "Job Board <onboarding@resend.dev>",
          to: user.email,
          subject: "Daily Job Listings Applications",
          react: DailyApplicationEmail({
            userName: user.name,
            applications,
          }),
        });
      });
    }
  );

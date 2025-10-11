import { serve } from "inngest/next";

import { inngest } from "@/services/inngest/client";
import {
  clerkCreateOrganization,
  clerkCreateUser,
  clerkDeleteOrganization,
  clerkDeleteUser,
  clerkUpdateOrganization,
  clerkUpdateUser,
} from "@/services/inngest/functions/clerk";
import { createAiSummaryOfUploadedResume } from "@/services/inngest/functions/resumes";
import { rankingApplicant } from "@/services/inngest/functions/job-listing-applications";
import {
  properDailyUserJobListingNotifications,
  sendDailyUserJobListingEmail,
} from "@/services/inngest/functions/email";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    clerkCreateUser,
    clerkUpdateUser,
    clerkDeleteUser,
    clerkCreateOrganization,
    clerkUpdateOrganization,
    clerkDeleteOrganization,
    createAiSummaryOfUploadedResume,
    rankingApplicant,
    properDailyUserJobListingNotifications,
    sendDailyUserJobListingEmail,
  ],
});

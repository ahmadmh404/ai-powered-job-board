import { serve } from "inngest/next";

import { inngest } from "@/app/services/inngest/client";
import {
  clerkCreateOrganization,
  clerkCreateUser,
  clerkDeleteOrganization,
  clerkDeleteUser,
  clerkUpdateOrganization,
  clerkUpdateUser,
} from "@/app/services/inngest/functions/clerk";
import { createAiSummaryOfUploadedResume } from "@/app/services/inngest/functions/resumes";
import { rankingApplicant } from "@/app/services/inngest/functions/job-listing-applications";

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
  ],
});

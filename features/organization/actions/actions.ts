"use server";

import z from "zod";
import { organizationUserSettingsSchema } from "./schemas";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/get-current-auth";

import { updateOrganizationUserSettings as updateOrganizationUserSettingsDB } from "../db/organization-user-settings";

export async function updateOrganizationUserSettings(
  unsafeData: z.infer<typeof organizationUserSettingsSchema>
) {
  const { userId } = await getCurrentUser();
  const { orgId } = await getCurrentOrganization();

  if (userId == null || orgId == null) {
    return {
      error: true,
      message: "There was an error updating your notification settings",
    };
  }
  const { success, data } =
    organizationUserSettingsSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "THere was an error updating your notification settings",
    };
  }

  await updateOrganizationUserSettingsDB(userId, orgId, {
    ...data,
  });

  return {
    error: false,
    message: "Successfully updated notification settings",
  };
}

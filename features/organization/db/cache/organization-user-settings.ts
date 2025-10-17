import { getGlobalTag, getIdlTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export function getOrganizationUserSettingsGlobalTag() {
  return getGlobalTag("organization-user-settings");
}

export function getOrganizationUserSettingsIdTag({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) {
  return getIdlTag("organization-user-settings", `${organizationId}-${userId}`);
}

export function revalidateOrganizationUserSettingsCache({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) {
  revalidateTag(getOrganizationUserSettingsGlobalTag());
  revalidateTag(
    getOrganizationUserSettingsIdTag({
      userId,
      organizationId,
    })
  );
}

"use client";

import { useForm } from "react-hook-form";
import { OrganizationUserSettingsTable } from "@/drizzle/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizationUserSettingsSchema } from "../actions/schemas";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { RatingIcon } from "@/features/job-listing-applications/components/rating-icon";
import { RATING_OPTIONS } from "../../job-listing-applications/data/constants";
import { updateOrganizationUserSettings } from "../actions/actions";
import { toast } from "sonner";

const ANY_VALUE = "Any";

export function NotificationSettingsForm({
  notificationSettings,
}: {
  notificationSettings?: Pick<
    typeof OrganizationUserSettingsTable.$inferSelect,
    "newApplicationEmailNotifications" | "minimumRating"
  >;
}) {
  const form = useForm({
    resolver: zodResolver(organizationUserSettingsSchema),
    defaultValues: notificationSettings ?? {
      minimumRating: null,
      newApplicationEmailNotifications: false,
    },
  });

  async function onSUbmit(
    data: z.infer<typeof organizationUserSettingsSchema>
  ) {
    const result = await updateOrganizationUserSettings(data);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }
  }

  const newApplicationEmailNotifications = form.watch(
    "newApplicationEmailNotifications"
  );

  return (
    <Form {...form}>
      <form
        className="border rounded-lg p-4 space-y-6"
        onSubmit={form.handleSubmit(onSUbmit)}
      >
        <FormField
          control={form.control}
          name="newApplicationEmailNotifications"
          render={({ field }) => (
            <FormItem>
              <div className="w-full flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Daily Email Notifications</FormLabel>
                  <FormDescription>
                    Receive a summary email of all job listing applications
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {newApplicationEmailNotifications && (
          <FormField
            control={form.control}
            name="minimumRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Rating</FormLabel>

                <Select
                  value={field.value ? field.value.toString() : ANY_VALUE}
                  onValueChange={(val) =>
                    field.onChange(val === ANY_VALUE ? null : parseInt(val))
                  }
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      {field.value === null ? (
                        <span>Any Rating</span>
                      ) : (
                        <RatingIcon rating={field.value} />
                      )}
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="w-full">
                    <SelectItem value={ANY_VALUE}>Any Rating</SelectItem>

                    {RATING_OPTIONS.filter((r) => r != null).map((rating) => (
                      <SelectItem value={rating.toString()} key={rating}>
                        <RatingIcon rating={rating} className="text-inherit" />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormDescription>
                  Only receive notifications for candidates that meet or exceed
                  this rating. Candidates 3-5 stars should meet all job
                  requirements and are likely a good fit for the role.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Save Notifications Settings
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { UserNotificationSettingsTable } from "../../../../drizzle/schemas/user-notification-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserNotificationSettingsSchema } from "../actions/schemas";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/loading-swap";
import { toast } from "sonner";
import { updateUserNotificationSettings } from "../actions/user-notification-settings-actions";

export function NotificationSettingsForm({
  notificationSettings,
}: {
  notificationSettings: Pick<
    typeof UserNotificationSettingsTable.$inferSelect,
    "newJobEmailNotifications" | "aiPrompt"
  >;
}) {
  const form = useForm({
    resolver: zodResolver(UserNotificationSettingsSchema),
    defaultValues: notificationSettings ?? {
      aiPrompt: "",
      newJoEmailNotification: false,
    },
  });

  async function onSUbmit(
    data: z.infer<typeof UserNotificationSettingsSchema>
  ) {
    const result = await updateUserNotificationSettings(data);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }
  }

  const newJobNotificationSettings = form.watch("newJobEmailNotifications");

  return (
    <Form {...form}>
      <form
        className="border rounded-lg p-4 space-y-6"
        onSubmit={form.handleSubmit(onSUbmit)}
      >
        <FormField
          control={form.control}
          name="newJobEmailNotifications"
          render={({ field }) => (
            <FormItem>
              <div className="w-full flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Daily Email Notifications</FormLabel>
                  <FormDescription>
                    Receive emails about job listings that match your interests
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

        {newJobNotificationSettings && (
          <FormField
            control={form.control}
            name="aiPrompt"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-0.5">
                  <FormLabel>Filter Prompt</FormLabel>

                  <FormDescription>
                    Out AI will use this prompt to filer job listings and only
                    send you notifications for jobs that match your criteria
                  </FormDescription>
                </div>

                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    className="min-h-32"
                    placeholder="Describe the jobs you`re interested in, for example:
                    `I am looking for remote frontend positions that use React and pays at least 100k/year `"
                  />
                </FormControl>

                <FormDescription>
                  Leave blank to receive notifications for all job listings
                </FormDescription>
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

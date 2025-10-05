"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { MDXMarkdownEditor } from "@/components/markdown/markdown";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/loading-swap";
import { toast } from "sonner";
import { jobListingApplicationSchema } from "../../job-listing-applications/actions/schemas";
import { createJobListingApplication } from "../../job-listing-applications/actions/actions";

export default function NewJobListingApplicationForm({
  jobListingId,
}: {
  jobListingId: string;
}) {
  const form = useForm({
    resolver: zodResolver(jobListingApplicationSchema),
    defaultValues: {
      coverLetter: "",
    },
  });

  // Complete From Here
  async function onSubmit(data: z.infer<typeof jobListingApplicationSchema>) {
    const results = await createJobListingApplication(jobListingId, data);

    if (results.error) {
      toast.error(results.message);
      return;
    }

    toast.success(results.message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="coverLetter"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>

              <FormControl>
                <MDXMarkdownEditor
                  {...field}
                  markdown={field.value ?? ""}
                  className="overflow-y-auto h-full max-h-[400px]"
                />
              </FormControl>

              <FormDescription>Optional</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Apply
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}

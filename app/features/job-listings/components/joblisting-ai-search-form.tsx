"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { jobListingAISearchSchema } from "../actions/schemas";
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
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/loading-swap";
import { toast } from "sonner";
import { getJobListingAISearchResults } from "../db/job-listings";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export function JobListingAISearchForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(jobListingAISearchSchema),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof jobListingAISearchSchema>) => {
    const results = await getJobListingAISearchResults(data);
    if (results?.error) {
      toast.error(results.message);
      return;
    }

    const params = new URLSearchParams();
    results.jobIds.forEach((id) => params.append("jobIds", id));
    router.push(`/?${params.toString()}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Query</FormLabel>
              {/* Replace the Input with Textarea */}
              <FormControl>
                <Textarea {...field} className="min-h-32" />
              </FormControl>

              <FormDescription>
                Provide a description of your skills/experience as well as what
                you are looking for in a job. The more specific you are, the
                more better the results you&apos;ll get
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Search
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}

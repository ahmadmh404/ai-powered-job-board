"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobListingSchema } from "../actions/schemas";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  experienceLevels,
  JobListingTable,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schemas";
import {
  formatExperienceLevel,
  formatJobType,
  formatLocationRequirements,
  formatWageIntervals,
} from "../lib/formatters";
import { StateSelectItems } from "./state-abbreviation-items";
import { MDXMarkdownEditor } from "@/components/markdown/markdown";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/loading-swap";
import { createJobListing, updateJobListing } from "../actions/actions";
import { toast } from "sonner";

const NON_SELECT_VALUE = "none";

type Props = {
  jobListing?: Pick<
    typeof JobListingTable.$inferSelect,
    | "id"
    | "title"
    | "description"
    | "city"
    | "type"
    | "wage"
    | "wageInterval"
    | "locationRequirement"
    | "experienceLevel"
    | "stateAbbreviation"
  >;
};

function JobListingForm({ jobListing }: Props) {
  const form = useForm({
    resolver: zodResolver(JobListingSchema),
    defaultValues: jobListing
      ? jobListing
      : {
          title: "",
          description: "",
          city: null,
          stateAbbreviation: null,
          wage: null,
          wageInterval: "yearly",
          experienceLevel: "junior",
          locationRequirement: "in-office",
          type: "full-time",
        },
  });

  async function onSubmit(data: z.infer<typeof JobListingSchema>) {
    console.log("data: ", data);

    const action = jobListing
      ? updateJobListing.bind(null, jobListing.id)
      : createJobListing;

    const res = await action(data);

    if (res.error) {
      toast.error(res.message);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 @container"
      >
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="wage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wage</FormLabel>

                <div className="flex">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value ?? ""}
                      className="rounded-r-none"
                      onChange={(e) => {
                        field.onChange(
                          isNaN(e.target.valueAsNumber)
                            ? null
                            : e.target.valueAsNumber
                        );
                      }}
                    />
                  </FormControl>

                  {/*  the wage intervals */}
                  <FormField
                    name="wageInterval"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Select value={field.value ?? ""}>
                          <FormControl>
                            <SelectTrigger className="rounded-l-none">
                              / <SelectValue />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {wageIntervals.map((interval) => (
                              <SelectItem key={interval} value={interval}>
                                {formatWageIntervals(interval)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <div className="grid grid-cols-1 @xs:grid-cols-2 gap-x-4 gap-y-2 items-start">
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>

                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="stateAbbreviation"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(val) =>
                      field.onChange(val === NON_SELECT_VALUE ? null : val)
                    }
                  >
                    <FormControl suppressHydrationWarning>
                      <SelectTrigger className="w-full">
                        / <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {field.value != null && (
                        <SelectItem value={NON_SELECT_VALUE}>Clear</SelectItem>
                      )}
                      <StateSelectItems />
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="locationRequirement"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Requirement</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {locationRequirements.map((lr) => (
                      <SelectItem key={lr} value={lr}>
                        {formatLocationRequirements(lr)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job TYpe</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {jobListingTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatJobType(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="experienceLevel"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience LEvel</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {formatExperienceLevel(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <MDXMarkdownEditor {...field} markdown={field.value} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          className="w-full"
          type="submit"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Create Job Listing
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}

export default JobListingForm;

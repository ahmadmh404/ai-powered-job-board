"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { JobListingStatus } from "@/drizzle/schema";
import { useParams } from "next/navigation";
import { formatJobListingStatus } from "../features/job-listings/lib/formators";
import { ChevronRightIcon } from "lucide-react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";

export type JobListings = {
  id: string;
  title: string;
  status: JobListingStatus;
  applicationCount: number;
}[];

type Props = {
  status: JobListingStatus;
  jobListings: JobListings;
};

export default function JobLIstingMenuGroup({ jobListings, status }: Props) {
  const { jobListingId } = useParams();

  return (
    <SidebarMenu>
      <Collapsible
        defaultOpen={
          status !== "delisted" ||
          jobListings.some((jobListing) => jobListing.id == jobListingId)
        }
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              {formatJobListingStatus(status)}
              <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}

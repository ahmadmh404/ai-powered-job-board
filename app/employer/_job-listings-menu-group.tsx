"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { JobListingStatus } from "@/drizzle/schemas";
import { useParams } from "next/navigation";
import { formatJobListingStatus } from "../features/job-listings/lib/formators";
import { ChevronRightIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

export type JobListing = {
  id: string;
  title: string;
  status: JobListingStatus;
  applicationCount: number;
};

type Props = {
  status: JobListingStatus;
  jobListings: JobListing[];
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

          <CollapsibleContent>
            <SidebarMenuSub>
              {jobListings.map((job) => (
                <JobListingMenuItem key={job.id} jobListing={job} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}

function JobListingMenuItem({ jobListing }: { jobListing: JobListing }) {
  const { jobListingId } = useParams();

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton isActive={jobListingId === jobListing.id} asChild>
        <Link href={`/employer/job-listing/${jobListing.id}`}>
          <span className="truncate">{jobListing.title}</span>

          {jobListing.applicationCount > 0 && (
            <div className="absolute right-2 text-sm text-muted-foreground">
              {jobListing.applicationCount}
            </div>
          )}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

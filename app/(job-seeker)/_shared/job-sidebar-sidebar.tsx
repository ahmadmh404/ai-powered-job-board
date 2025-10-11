import JobListingFilterForm from "@/features/job-listings/components/job-listing-filter-form";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import React from "react";

function JobBoardSidebar() {
  return (
    <SidebarGroup className="group-data-[state=collapsed]:hidden">
      <SidebarGroupContent>
        <JobListingFilterForm />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default JobBoardSidebar;

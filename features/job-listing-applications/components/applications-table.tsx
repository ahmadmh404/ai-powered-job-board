"use client";

import { DataTable } from "@/components/data-table/datatable";
import { DataTableSortableColumn } from "@/components/data-table/data-table-sortable-column";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ApplicationStage,
  applicationStages,
  JobLIstingApplicationTable,
  UserResumeTable,
  UserTable,
} from "@/drizzle/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode, useOptimistic, useTransition } from "react";
import { sortApplicationByStage } from "../lib/utils";
import { formatJobListingApplicationStage } from "../lib/formatters";
import { StageIcon } from "./stage-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  updateJobListingApplicationRating,
  updateJobListingApplicationStage,
} from "../actions/actions";
import { toast } from "sonner";
import { RatingIcon } from "./rating-icon";
import { ChevronDownIcon } from "lucide-react";
import { RATING_OPTIONS } from "../data/constants";
import { Button } from "@/components/ui/button";

type Application = Pick<
  typeof JobLIstingApplicationTable.$inferSelect,
  "createdAt" | "rating" | "stage" | "jobListingId"
> & {
  coverLetterMarkdown: ReactNode | null;
  user: Pick<typeof UserTable.$inferSelect, "id" | "name" | "imageUrl"> & {
    resume: Pick<
      typeof UserResumeTable.$inferSelect,
      "resumeFileUrl" & {
        markdownSummary: ReactNode | null;
      }
    > | null;
  };
};

type Props = {
  applications: Application[];
  canUpdateRating: boolean;
  canUpdateStage: boolean;
};

function getColumns(
  canUpdateRating: boolean,
  canUpdateStage: boolean
): ColumnDef<Application>[] {
  return [
    {
      accessorFn: (row) => row.user.name,
      header: "Name",
      cell: ({ row }) => {
        const user = row.original.user;
        const nameInitials = user.name
          .split(" ")
          .slice(0, 2)
          .map((name) => name.charAt(0).toUpperCase())
          .join("");

        return (
          <div className="flex items-center gap-4">
            <Avatar className="rounded-full size-6">
              <AvatarImage src={user.imageUrl ?? undefined} alt={user.name} />
              <AvatarFallback className="text-primary-foreground bg-primary uppercase text-xs">
                {nameInitials}
              </AvatarFallback>
            </Avatar>

            <span>{user.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "Stage",
      header: ({ column }) => (
        <DataTableSortableColumn title="stage" column={column} />
      ),
      sortingFn: ({ original: a }, { original: b }) => {
        return sortApplicationByStage(a.stage, b.stage);
      },
      filterFn: ({ original }, _, value) => {
        return value.includes(original.stage);
      },
      cell: ({ row }) => (
        <StageCell
          stage={row.original.stage}
          canUpdate={canUpdateStage}
          jobListingId={row.original.jobListingId}
          userId={row.original.user.id}
        />
      ),
    },
    {
      accessorKey: "Rating",
      header: ({ column }) => (
        <DataTableSortableColumn title="Rating" column={column} />
      ),
      filterFn: ({ original }, _, value) => {
        return value.includes(original.stage);
      },
      cell: ({ row }) => (
        <RatingCell
          rating={row.original.rating}
          canUpdate={canUpdateRating}
          jobListingId={row.original.jobListingId}
          userId={row.original.user.id}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataTableSortableColumn title="Applied On" column={column} />
      ),
      cell: ({ row }) => {
        return row.original.createdAt.toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const jobListing = row.original;
        const resume = jobListing.user.resume;

        return <ActionsCell />;
      },
    },
  ];
}

// applications table
export function ApplicationsTable({
  applications,
  canUpdateRating,
  canUpdateStage,
}: Props) {
  return <DataTable data={applications} columns={getColumns(true, true)} />;
}

// stage cell
type StageCellProps = {
  canUpdate: boolean;
  userId: string;
  jobListingId: string;
  stage: ApplicationStage;
};

function StageCell({ canUpdate, jobListingId, stage, userId }: StageCellProps) {
  const [optimizedStage, setOptimisticStage] = useOptimistic(stage);
  const [isPending, startTransition] = useTransition();

  if (!canUpdate) {
    return <StageDetails stage={optimizedStage} />;
  }

  const handleUpdateApplicationStage = (stage: ApplicationStage) => {
    startTransition(async () => {
      setOptimisticStage(stage);
      const res = await updateJobListingApplicationStage(
        {
          jobListingId,
          userId,
        },
        stage
      );

      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn("-ml-3 flex gap-x-2", isPending && "opacity-50")}
        >
          <StageDetails stage={optimizedStage} />
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {applicationStages
          .toSorted(sortApplicationByStage)
          .map((stageValue) => (
            <DropdownMenuItem
              key={stageValue}
              onClick={() => handleUpdateApplicationStage(stageValue)}
            >
              <StageDetails stage={stageValue} />
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Rating Cell
type RatingCellProps = {
  canUpdate: boolean;
  userId: string;
  jobListingId: string;
  rating: number | null;
};

function RatingCell({
  canUpdate,
  jobListingId,
  rating,
  userId,
}: RatingCellProps) {
  const [optimisticRating, setOptimisticRating] = useOptimistic(rating);
  const [isPending, startTransition] = useTransition();

  if (!canUpdate) {
    return <RatingIcon rating={optimisticRating} />;
  }

  const handleUpdateApplicationRating = (rating: number | null) => {
    startTransition(async () => {
      setOptimisticRating(rating);
      const res = await updateJobListingApplicationRating(
        {
          jobListingId,
          userId,
        },
        rating
      );

      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn("-ml-3", isPending && "opacity-50")}
        >
          <RatingIcon rating={optimisticRating} />
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {RATING_OPTIONS.map((ratingValue) => (
          <DropdownMenuItem
            key={ratingValue ?? "None"}
            onClick={() => handleUpdateApplicationRating(ratingValue)}
          >
            <RatingIcon rating={ratingValue} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type ActionsCellType = {
  coverLetterMarkdown: ReactNode | null;
  resumeMarkdown: ReactNode | null;
  userName: string;
  resumeUrl: string | null;
};

function StageDetails({ stage }: { stage: ApplicationStage }) {
  return (
    <div className="flex gap-2 items-center">
      <StageIcon stage={stage} className="size-5 text-inherit" />
      <div>{formatJobListingApplicationStage(stage)}</div>
    </div>
  );
}

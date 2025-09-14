import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { JobListingStatus } from "@/drizzle/schema";
import { EyeIcon, EyeOffIcon, Link } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  buttonText: ReactNode;
  popoverText: ReactNode;
};

export default function UpgradePopover({ buttonText, popoverText }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"}>{buttonText}</Button>
      </PopoverTrigger>

      <PopoverContent className="flex flex-col gap-2">
        <p className="text-center">{popoverText}</p>
        <Button asChild>
          <Link href={"/employer/pricing"}>Upgrade Plan</Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export function JobListingStatusText(status: JobListingStatus) {
  switch (status) {
    case "delisted":
    case "draft":
      return (
        <>
          <EyeIcon className="size-4" />
          Publish
        </>
      );

    case "published":
      return (
        <>
          <EyeOffIcon className="size-4" />
          Delist
        </>
      );
  }
}

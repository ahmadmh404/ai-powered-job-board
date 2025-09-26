import { ComponentProps } from "react";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoadingSpinner({
  className,
  ...props
}: ComponentProps<typeof Loader2Icon>) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader2Icon
        className={cn(`animate-spin size-16`, className)}
        {...props}
      />
    </div>
  );
}

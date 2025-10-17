import { ReactNode } from "react";
import { RATING_OPTIONS } from "../data/constants";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingIcon({
  rating,
  className,
}: {
  rating: number | null;
  className?: string;
}) {
  if (rating == null || rating < 1 || rating > 5) return "Unrated";

  const stars: ReactNode[] = RATING_OPTIONS.filter((r) => r != null).map(
    (index) => (
      <StarIcon
        key={index}
        className={cn(`size-5`, rating >= index && "fill-current", className)}
      />
    )
  );

  return (
    <div className="flex gap-1">
      {stars}
      <span className="sr-only"> {rating} out of 5</span>
    </div>
  );
}

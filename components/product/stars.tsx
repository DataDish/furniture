import { StarIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export function Stars({
  rating,
  className,
  size = "h-4 w-4",
}: {
  rating: number;
  className?: string;
  size?: string;
}) {
  return (
    <div
      className={clsx("flex items-center gap-0.5", className)}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          className={clsx(
            size,
            i <= Math.round(rating) ? "text-brass" : "text-sand",
          )}
        />
      ))}
    </div>
  );
}

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center text-ink transition-colors">
      <ShoppingBagIcon
        strokeWidth={1.25}
        className={clsx(
          "h-5 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />

      {quantity ? (
        <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brass text-[10px] font-medium text-bone">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}

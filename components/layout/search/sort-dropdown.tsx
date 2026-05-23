"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { sorting } from "lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "";

  return (
    <div className="relative inline-flex items-center">
      <label className="sr-only" htmlFor="sort">
        Sort by
      </label>
      <select
        id="sort"
        value={current}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value) params.set("sort", e.target.value);
          else params.delete("sort");
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        className="appearance-none border-b border-sand bg-transparent py-1.5 pr-7 text-xs uppercase tracking-[0.15em] text-ink focus:border-ink"
      >
        {sorting.map((item) => (
          <option key={item.title} value={item.slug ?? ""}>
            {item.title}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-0 h-4 w-4 text-clay" />
    </div>
  );
}

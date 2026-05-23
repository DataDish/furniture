"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className="relative w-full">
      <input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder="Search"
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="w-full border-b border-sand bg-transparent py-1.5 pr-7 text-sm text-ink placeholder:text-clay/70 focus:border-ink focus-visible:ring-0"
      />
      <div className="absolute right-0 top-0 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 text-clay" />
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="relative w-full">
      <input
        placeholder="Search"
        className="w-full border-b border-sand bg-transparent py-1.5 pr-7 text-sm text-ink placeholder:text-clay/70"
      />
      <div className="absolute right-0 top-0 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 text-clay" />
      </div>
    </form>
  );
}

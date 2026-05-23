import clsx from "clsx";
import Link from "next/link";

const PILLS = [
  { title: "All", handle: "" },
  { title: "Living", handle: "living" },
  { title: "Dining", handle: "dining" },
  { title: "Bedroom", handle: "bedroom" },
  { title: "Lighting", handle: "lighting" },
  { title: "New", handle: "new" },
];

export function CollectionPills({ active }: { active?: string }) {
  return (
    <nav className="flex flex-wrap items-center gap-2">
      {PILLS.map((pill) => {
        const href = pill.handle ? `/search/${pill.handle}` : "/search";
        const isActive = (active ?? "") === pill.handle;
        return (
          <Link
            key={pill.title}
            href={href}
            prefetch={true}
            className={clsx(
              "border px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors",
              isActive
                ? "border-ink bg-ink text-bone"
                : "border-sand text-walnut hover:border-ink",
            )}
          >
            {pill.title}
          </Link>
        );
      })}
    </nav>
  );
}

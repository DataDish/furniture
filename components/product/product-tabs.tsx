"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { Product, Spec } from "lib/shopify/types";
import Link from "next/link";
import { type ReactNode, useState } from "react";

function SpecList({ rows }: { rows: Spec[] }) {
  return (
    <dl className="mx-auto max-w-xl divide-y divide-sand border-t border-sand">
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-6 py-3">
          <dt className="text-sm text-clay">{r.label}</dt>
          <dd className="text-right text-sm text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProductTabs({ product }: { product: Product }) {
  const meta = product.meta;

  const tabs: { id: string; label: string; content: ReactNode }[] = [
    {
      id: "dimensions",
      label: "Dimensions",
      content: meta?.dimensions?.length ? (
        <SpecList rows={meta.dimensions} />
      ) : (
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-walnut lg:text-center">
          Detailed dimensions for this piece are available on request —{" "}
          <Link href="/contact" className="border-b border-clay hover:text-ink">
            contact a specialist
          </Link>
          .
        </p>
      ),
    },
    {
      id: "tear-sheet",
      label: "Tear Sheet",
      content: meta?.tearSheet ? (
        <div className="mx-auto max-w-xl text-sm leading-relaxed text-walnut lg:text-center">
          <p>
            Download the full specification sheet — dimensions, materials, and
            finishes — for this piece.
          </p>
          <a
            href={meta.tearSheet}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 border border-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-bone"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download tear sheet (PDF)
          </a>
        </div>
      ) : (
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-walnut lg:text-center">
          Tear sheets with full specifications are available to clients and the
          trade on request.{" "}
          <Link href="/contact" className="border-b border-clay hover:text-ink">
            Request a tear sheet
          </Link>
          .
        </p>
      ),
    },
    {
      id: "care",
      label: "Care Instructions",
      content: (
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-walnut lg:text-center">
          {meta?.care ??
            "Dust regularly with a soft, dry cloth. Keep out of prolonged direct sunlight and away from heat sources. For any spills, blot immediately and avoid harsh cleaners."}
        </p>
      ),
    },
    {
      id: "delivery",
      label: "Delivery & Returns",
      content: (
        <div className="mx-auto max-w-xl space-y-3 text-sm leading-relaxed text-walnut lg:text-center">
          <p>
            <span className="font-medium text-ink">Delivery.</span>{" "}
            Complimentary white-glove delivery on every order. Our team brings
            your piece into the room of your choice, assembles it, and removes
            all packaging.{" "}
            {meta?.leadTime ?? "Most pieces ship within 1–2 weeks."}
          </p>
          <p>
            <span className="font-medium text-ink">100-night trial.</span> Live
            with your piece for 100 nights. If it isn't right, we'll arrange the
            return to our US warehouse; the cost of return shipping is the
            customer's responsibility. Refunds are issued for pieces returned in
            original, resellable condition.
          </p>
          <p>
            Full details on the{" "}
            <Link href="/trial" className="border-b border-clay hover:text-ink">
              100-night trial
            </Link>{" "}
            and{" "}
            <Link
              href="/delivery"
              className="border-b border-clay hover:text-ink"
            >
              delivery
            </Link>{" "}
            pages.
          </p>
        </div>
      ),
    },
  ];

  const [active, setActive] = useState(tabs[0]!.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0]!;

  return (
    <section className="mx-auto max-w-[1000px] px-4 py-16 lg:px-8 lg:py-20">
      <div className="flex gap-8 overflow-x-auto border-b border-sand [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:justify-center">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={clsx(
              "shrink-0 border-b-2 pb-3 text-xs font-medium uppercase tracking-[0.18em] transition-colors",
              active === t.id
                ? "border-ink text-ink"
                : "border-transparent text-clay hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="py-8">{current.content}</div>
    </section>
  );
}

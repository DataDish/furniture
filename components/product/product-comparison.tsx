import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Reveal } from "components/motion/reveal";
import clsx from "clsx";
import type { ComparisonRow, Product } from "lib/shopify/types";

// Brand-wide default. Override per product with the `details.comparison`
// metafield (json): [{ "feature": "...", "us": true|"text", "original": ..., "mass": ... }]
const DEFAULT_COMPARISON: ComparisonRow[] = [
  {
    feature: "Identical to the original design",
    us: true,
    original: true,
    mass: false,
  },
  {
    feature: "Genuine materials, never substituted",
    us: true,
    original: true,
    mass: false,
  },
  {
    feature: "Made by the same ateliers",
    us: true,
    original: true,
    mass: false,
  },
  { feature: "Customizable", us: true, original: true, mass: false },
  {
    feature: "White-glove delivery & assembly",
    us: true,
    original: "Often paid",
    mass: false,
  },
  {
    feature: "In-home trial",
    us: "100 nights",
    original: "30 days",
    mass: "Varies",
  },
  { feature: "Warranty", us: "Lifetime", original: "Limited", mass: "1 year" },
];

function Cell({
  value,
  highlight,
}: {
  value: boolean | string;
  highlight?: boolean;
}) {
  if (typeof value === "boolean") {
    return value ? (
      <CheckCircleIcon
        className={clsx(
          "mx-auto h-5 w-5",
          highlight ? "text-sage" : "text-stone",
        )}
      />
    ) : (
      <XCircleIcon className="mx-auto h-5 w-5 text-stone/50" />
    );
  }
  return (
    <span
      className={clsx(
        "block text-center text-sm",
        highlight ? "font-medium text-ink" : "text-clay",
      )}
    >
      {value}
    </span>
  );
}

export function ProductComparison({ product }: { product: Product }) {
  const rows = product.meta?.comparison?.length
    ? product.meta.comparison
    : DEFAULT_COMPARISON;

  const cell = "flex items-center justify-center px-3 py-4";

  return (
    <section className="mx-auto max-w-[1000px] px-4 py-20 lg:px-8 lg:py-24">
      <Reveal className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-clay">
          How we compare
        </p>
        <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">
          Maison Noyer vs. the alternatives
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-walnut">
          The same design and materials as the original — the things a
          mass-market copy leaves out, without the gallery price.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 overflow-x-auto">
        <div className="mx-auto min-w-[600px] max-w-3xl overflow-hidden rounded-2xl border border-sand">
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr]">
            {/* Header */}
            <div className="bg-bone" />
            <div className="bg-ink py-4 text-center font-serif text-base tracking-[0.12em] text-bone uppercase">
              Maison&nbsp;Noyer
            </div>
            <div className="bg-bone py-4 text-center text-xs font-medium uppercase tracking-[0.15em] text-ink">
              The Original
            </div>
            <div className="bg-bone py-4 text-center text-xs font-medium uppercase tracking-[0.15em] text-ink">
              Mass-Market
            </div>

            {/* Rows */}
            {rows.map((row) => (
              <div key={row.feature} className="contents">
                <div className="border-t border-sand bg-bone px-5 py-4 text-sm text-ink">
                  {row.feature}
                </div>
                <div className={clsx(cell, "border-t border-sand bg-cream")}>
                  <Cell value={row.us} highlight />
                </div>
                <div className={clsx(cell, "border-t border-sand bg-bone")}>
                  <Cell value={row.original} />
                </div>
                <div className={clsx(cell, "border-t border-sand bg-bone")}>
                  <Cell value={row.mass} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

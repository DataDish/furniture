import { Reveal } from "components/motion/reveal";
import clsx from "clsx";

const usd0 = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const BREAKDOWN: {
  label: string;
  pct: number;
  bar: string;
  text: string;
  note: string;
}[] = [
  {
    label: "Cost of the product",
    pct: 50,
    bar: "bg-espresso",
    text: "text-bone",
    note: "Materials, craftsmanship, duties, and taxes — the piece itself.",
  },
  {
    label: "Marketing",
    pct: 25,
    bar: "bg-brass",
    text: "text-bone",
    note: "Reaching new clients and telling our story.",
  },
  {
    label: "Shipping",
    pct: 10,
    bar: "bg-walnut",
    text: "text-bone",
    note: "White-glove delivery, right to your room.",
  },
  {
    label: "Operations & fulfillment",
    pct: 5,
    bar: "bg-stone",
    text: "text-ink",
    note: "Running the studio day to day.",
  },
  {
    label: "Customer service",
    pct: 3,
    bar: "bg-sage",
    text: "text-bone",
    note: "Real specialists, here before and long after you buy.",
  },
  {
    label: "What we make",
    pct: 7,
    bar: "bg-clay",
    text: "text-bone",
    note: "Our profit — reinvested entirely into adding new styles to the collection and making your experience better, season after season.",
  },
];

export function PriceTransparency({ price }: { price?: string }) {
  const total = price ? Number(price) : undefined;

  return (
    <section className="border-y border-sand bg-bone">
      <div className="mx-auto max-w-[1000px] px-4 py-20 lg:px-8 lg:py-24">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-clay">
            Honest pricing
          </p>
          <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">
            Where your money goes
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-walnut">
            We think you should know exactly what you are paying for. Here is
            how every dollar of {total ? "this piece" : "your order"} breaks
            down.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          {/* Stacked bar */}
          <div className="flex h-14 w-full overflow-hidden rounded-lg">
            {BREAKDOWN.map((b) => (
              <div
                key={b.label}
                className={clsx(
                  "flex items-center justify-center",
                  b.bar,
                  b.text,
                )}
                style={{ width: `${b.pct}%` }}
              >
                {b.pct >= 10 ? (
                  <span className="text-xs font-medium">{b.pct}%</span>
                ) : null}
              </div>
            ))}
          </div>

          {/* Legend */}
          <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {BREAKDOWN.map((b) => (
              <li key={b.label} className="flex gap-3">
                <span
                  className={clsx("mt-1.5 h-3 w-3 flex-none rounded-sm", b.bar)}
                />
                <div>
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-serif text-lg text-ink">
                      {b.label}
                    </span>
                    <span className="text-sm text-clay">
                      {b.pct}%{total ? ` · ${usd0((total * b.pct) / 100)}` : ""}
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-walnut">
                    {b.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center text-xs text-clay">
            Duties and taxes are included within the cost of the product.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

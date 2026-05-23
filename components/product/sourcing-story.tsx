import { Reveal, RevealGroup, RevealItem } from "components/motion/reveal";
import { Product } from "lib/shopify/types";

const usd0 = (n: string | number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));

export function SourcingStory({ product }: { product: Product }) {
  const meta = product.meta;
  if (!meta?.sourcingStory) return null;

  const price = product.priceRange.maxVariantPrice.amount;
  const comparable = meta.comparableAt?.amount;

  return (
    <section className="bg-espresso text-bone">
      <div className="mx-auto max-w-[1100px] px-4 py-20 lg:px-8 lg:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-brass-soft">
            Why is it less?
          </p>
          <h2 className="mt-5 font-serif text-3xl leading-tight md:text-4xl">
            {meta.comparableTo
              ? `The same piece as ${meta.comparableTo} — sourced honestly.`
              : "Sourced honestly, priced fairly."}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-bone/75">
            {meta.sourcingStory}
          </p>
        </Reveal>

        {comparable ? (
          <Reveal className="mx-auto mt-12 flex max-w-md items-stretch border border-bone/15">
            <div className="flex-1 border-r border-bone/15 px-6 py-7 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-bone/45">
                Traditional retail
              </p>
              <p className="mt-2 font-serif text-3xl text-bone/45 line-through">
                {usd0(comparable)}
              </p>
            </div>
            <div className="flex-1 px-6 py-7 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-brass-soft">
                Maison Noyer
              </p>
              <p className="mt-2 font-serif text-4xl">{usd0(price)}</p>
            </div>
          </Reveal>
        ) : null}

        <RevealGroup className="mt-16 grid gap-10 md:grid-cols-3">
          {[
            [
              "We go to the maker",
              meta.comparableTo
                ? `We commission directly from the atelier behind ${meta.comparableTo}.`
                : "We commission directly from the atelier, with no reseller in between.",
            ],
            [
              "We hold the spec",
              "The same materials, the same construction, the same hands. We never substitute a cheaper version.",
            ],
            [
              "We remove the markup",
              "No gallery, no showroom rent, no licensing fee — only the cost of making it well.",
            ],
          ].map(([title, body]) => (
            <RevealItem key={title}>
              <div className="border-t border-bone/15 pt-6">
                <h3 className="font-serif text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">
                  {body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {meta.craftNotes?.length ? (
          <Reveal className="mx-auto mt-16 max-w-2xl">
            <p className="text-center text-xs uppercase tracking-[0.25em] text-brass-soft">
              What that gets you
            </p>
            <ul className="mt-6 divide-y divide-bone/10">
              {meta.craftNotes.map((note) => (
                <li
                  key={note}
                  className="flex gap-4 py-4 text-sm leading-relaxed text-bone/80"
                >
                  <span className="font-serif text-brass-soft">—</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

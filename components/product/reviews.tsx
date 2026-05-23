import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Reveal, RevealGroup, RevealItem } from "components/motion/reveal";
import { Product } from "lib/shopify/types";
import { Stars } from "./stars";

export function Reviews({ product }: { product: Product }) {
  const meta = product.meta;
  if (!meta?.reviews?.length) return null;

  return (
    <section id="reviews" className="scroll-mt-32 bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-[1100px] px-4 lg:px-8">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-clay">
            Client reviews
          </p>
          <div className="flex items-center gap-3">
            <span className="font-serif text-5xl text-ink">{meta.rating}</span>
            <div className="text-left">
              <Stars rating={meta.rating ?? 5} />
              <p className="mt-1 text-sm text-clay">
                Based on {meta.reviewCount} verified reviews
              </p>
            </div>
          </div>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-2" stagger={0.07}>
          {meta.reviews.map((r) => (
            <RevealItem key={`${r.author}-${r.date}`}>
              <figure className="flex h-full flex-col border border-sand bg-bone p-7">
                <div className="flex items-center justify-between">
                  <Stars rating={r.rating} />
                  <span className="text-xs text-clay">
                    {new Date(r.date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <figcaption className="mt-4 font-serif text-xl text-ink">
                  {r.title}
                </figcaption>
                <blockquote className="mt-3 grow text-sm leading-relaxed text-walnut">
                  {r.body}
                </blockquote>
                <div className="mt-5 flex items-center gap-2 border-t border-sand pt-4 text-xs text-clay">
                  <span className="font-medium text-ink">{r.author}</span>
                  <span>·</span>
                  <span>{r.location}</span>
                  {r.verified ? (
                    <span className="ml-auto inline-flex items-center gap-1 text-sage">
                      <CheckBadgeIcon className="h-4 w-4" />
                      Verified buyer
                    </span>
                  ) : null}
                </div>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

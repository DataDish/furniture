import { Reveal } from "components/motion/reveal";
import { Product } from "lib/shopify/types";
import Image from "next/image";

export function ProductSpecs({ product }: { product: Product }) {
  const meta = product.meta;
  if (!meta?.designStory) return null;

  const detailImage = product.images[2]?.url ?? product.images[1]?.url;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 lg:px-8 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="lg:order-last">
          <p className="text-xs uppercase tracking-[0.3em] text-clay">
            The design
          </p>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-ink md:text-4xl">
            Considered down to the last detail.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-walnut">
            {meta.designStory}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          {detailImage ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream">
              <Image
                src={detailImage}
                alt={`${product.title} detail`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}

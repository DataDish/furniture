import { Hero } from "components/home/hero";
import Footer from "components/layout/footer";
import { Reveal, RevealGroup, RevealItem } from "components/motion/reveal";
import { ProductCard } from "components/product/product-card";
import { collectionHero, img } from "lib/data/catalog";
import { getProduct, getProducts } from "lib/shopify";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  description:
    "Gallery-grade furniture, sourced direct from the ateliers that make it for the world's most coveted houses — without the markup.",
  openGraph: { type: "website" },
};

const usd0 = (n: string | number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));

const CATEGORIES = [
  { handle: "living", title: "Living", copy: "Sofas & lounge" },
  { handle: "dining", title: "Dining", copy: "Tables & seating" },
  { handle: "bedroom", title: "Bedroom", copy: "Beds & rest" },
  { handle: "lighting", title: "Lighting", copy: "Sculptural light" },
];

export default async function HomePage() {
  const coveted = (await getProducts({ sortKey: "BEST_SELLING" })).slice(0, 8);
  const spotlight = await getProduct("lina-modular-sofa");

  return (
    <>
      <Hero image={img("1618220179428-22790b461013", 2400)} />

      {/* Brand promise strip */}
      <section className="border-b border-sand bg-cream">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-sand px-4 md:grid-cols-4 lg:px-8">
          {[
            ["Up to 70% less", "than the traditional retail price"],
            ["The same ateliers", "that supply the design houses"],
            ["100-night trial", "live with it before you commit"],
            ["White-glove delivery", "placed, assembled, complimentary"],
          ].map(([title, body]) => (
            <div key={title} className="px-4 py-7 text-center">
              <p className="font-serif text-lg text-ink md:text-xl">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-clay">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The difference — the sourcing thesis */}
      <section className="mx-auto max-w-[1400px] px-4 py-24 lg:px-8 lg:py-36">
        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.3em] text-clay">
              The Maison Noyer Difference
            </p>
            <h2 className="mt-6 font-serif text-4xl leading-[1.08] text-ink md:text-[3.25rem]">
              High design is not
              <br className="hidden md:block" /> the same as a high price.
            </h2>
            <p className="mt-7 max-w-md text-base leading-relaxed text-walnut">
              The furniture in design galleries is rarely made by the gallery.
              It is made by specialist ateliers, then marked up three to five
              times for the name on the tag. We keep the craft and remove the
              rest.
            </p>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <RevealGroup className="flex flex-col">
              {[
                [
                  "Direct from the atelier",
                  "We commission from the same family workshops in Italy, Portugal, and Vietnam that produce for the celebrated houses. No licensing, no showroom, no reseller.",
                ],
                [
                  "The same materials",
                  "Belgian linen by the bolt. Genuine Carrara marble from the quarry basin. Solid FSC oak from the mill. The exact specifications, never the cheaper substitute.",
                ],
                [
                  "None of the markup",
                  "You pay for the materials and the labor, the things that make a piece worth owning, and nothing for the four layers of distribution in between.",
                ],
              ].map(([title, body], i) => (
                <RevealItem key={title}>
                  <div className="flex gap-6 border-t border-stone/40 py-7 first:pt-0 first:border-t-0">
                    <span className="mt-1 font-serif text-sm text-brass">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl text-ink">{title}</h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-walnut">
                        {body}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Spotlight price comparison */}
      {spotlight ? (
        <section className="bg-espresso text-bone">
          <div className="mx-auto grid max-w-[1400px] items-stretch lg:grid-cols-2">
            <div className="relative min-h-[480px] overflow-hidden">
              <Image
                src={spotlight.images[1]?.url ?? spotlight.featuredImage.url}
                alt={spotlight.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <Reveal className="flex flex-col justify-center px-4 py-16 lg:px-16 lg:py-24">
              <p className="text-xs uppercase tracking-[0.3em] text-brass-soft">
                Case in point
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
                {spotlight.title}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-bone/75">
                {spotlight.meta?.sourcingStory}
              </p>

              <div className="mt-10 flex items-end gap-10">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-bone/50">
                    Traditional retail
                  </p>
                  <p className="mt-2 font-serif text-3xl text-bone/50 line-through">
                    {usd0(spotlight.meta?.comparableAt?.amount ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-brass-soft">
                    Maison Noyer
                  </p>
                  <p className="mt-2 font-serif text-5xl">
                    {usd0(spotlight.priceRange.maxVariantPrice.amount)}
                  </p>
                </div>
              </div>

              <Link
                href={`/product/${spotlight.handle}`}
                className="mt-10 inline-block w-max bg-bone px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-cream"
              >
                View the Lina Sofa
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Shop by category */}
      <section className="mx-auto max-w-[1400px] px-4 py-24 lg:px-8 lg:py-32">
        <Reveal className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-clay">
              The Collection
            </p>
            <h2 className="mt-4 font-serif text-4xl text-ink md:text-5xl">
              Shop by room
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden border-b border-ink pb-1 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:text-clay md:inline-block"
          >
            View all
          </Link>
        </Reveal>

        <RevealGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {CATEGORIES.map((cat) => (
            <RevealItem key={cat.handle}>
              <Link
                href={`/search/${cat.handle}`}
                className="img-hover-zoom group relative block aspect-[3/4] overflow-hidden bg-cream"
              >
                <Image
                  src={
                    collectionHero[cat.handle] ??
                    img("1618220179428-22790b461013")
                  }
                  alt={cat.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-bone/70">
                    {cat.copy}
                  </p>
                  <p className="mt-1 font-serif text-2xl text-bone">
                    {cat.title}
                  </p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Most coveted grid */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <Reveal className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-clay">
              Most Coveted
            </p>
            <h2 className="mt-4 font-serif text-4xl text-ink md:text-5xl">
              The pieces our clients live with
            </h2>
          </Reveal>
          <RevealGroup
            className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-6"
            stagger={0.06}
          >
            {coveted.map((product, i) => (
              <RevealItem key={product.handle}>
                <ProductCard product={product} priority={i < 4} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Craftsmanship editorial split */}
      <section className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-24 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-32">
        <Reveal className="order-2 lg:order-1">
          <p className="text-xs uppercase tracking-[0.3em] text-clay">
            Made by hand
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-tight text-ink md:text-5xl">
            The same hands behind the icons.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-walnut">
            A single upholsterer wraps and tufts each Lina sofa, then signs the
            base. A trained weaver spends ninety minutes on every Mila chair
            seat. Marble is selected by veining, one slab at a time. The skill
            that justifies a gallery's price is real — we just let you pay for
            the craft, not the name.
          </p>
          <Link
            href="/sourcing"
            className="mt-9 inline-block border-b border-ink pb-1 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:text-clay"
          >
            Inside our ateliers
          </Link>
        </Reveal>
        <Reveal delay={0.1} className="order-1 lg:order-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-cream">
              <Image
                src={img("1504148455328-c376907d081c", 800)}
                alt="A craftsman at work"
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-10 aspect-[3/4] overflow-hidden bg-cream">
              <Image
                src={img("1605117882932-f9e32b03fea9", 800)}
                alt="Material detail"
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Credibility — a lead voice, a stat band, then supporting voices */}
      <section className="bg-espresso py-24 text-bone lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <Reveal className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.3em] text-brass-soft">
              Why clients trust us
            </p>
            <blockquote className="mt-7 font-serif text-3xl leading-[1.25] text-bone md:text-[2.6rem]">
              &ldquo;We sat on the $9,800 version the same week ours arrived.
              Honestly, we could not tell them apart.&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-xs uppercase tracking-[0.2em] text-bone/55">
              Eleanor V. — Greenwich, CT · Verified buyer
            </figcaption>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 border-y border-bone/15 sm:grid-cols-3 sm:divide-x sm:divide-bone/15">
            {[
              ["4.9 / 5", "across 2,400+ verified reviews"],
              ["18,000+", "rooms furnished, and counting"],
              ["100 nights", "to decide, or we collect it free"],
            ].map(([stat, label]) => (
              <div key={stat} className="py-8 sm:px-8 sm:first:pl-0">
                <p className="font-serif text-4xl text-bone md:text-5xl">
                  {stat}
                </p>
                <p className="mt-2 text-sm text-bone/55">{label}</p>
              </div>
            ))}
          </div>

          <RevealGroup className="mt-14 grid gap-10 md:grid-cols-2 lg:gap-16">
            {[
              [
                "Real marble, real weight, real oak. I checked the end grain — it is the genuine thing all the way through.",
                "Yuki T.",
                "San Francisco, CA",
              ],
              [
                "The delivery team assembled everything and took the packaging. The luxury experience, at a quarter of the price.",
                "Marcus D.",
                "Austin, TX",
              ],
            ].map(([quote, name, place]) => (
              <RevealItem key={name}>
                <figure>
                  <blockquote className="font-serif text-xl leading-relaxed text-bone/85">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-xs uppercase tracking-[0.2em] text-bone/50">
                    {name} — {place}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] w-full">
          <Image
            src={img("1616486338812-3dadae4b4ace", 2000)}
            alt="A considered interior"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/55" />
          <Reveal className="absolute inset-0 mx-auto flex max-w-2xl flex-col items-center justify-center px-4 text-center">
            <h2 className="font-serif text-4xl leading-tight text-bone md:text-5xl">
              Considered furniture, without the markup.
            </h2>
            <p className="mt-5 max-w-lg text-base text-bone/80">
              Join the house list for early access to new pieces, private sales,
              and a look inside the ateliers we work with.
            </p>
            <Link
              href="/search"
              className="mt-8 bg-bone px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-cream"
            >
              Begin Browsing
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}

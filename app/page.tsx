import {
  ReceiptPercentIcon,
  SparklesIcon,
  MoonIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { Hero } from "components/home/hero";
import { CaseInPoint } from "components/home/case-in-point";
import { CovetedCarousel } from "components/home/coveted-carousel";
import Footer from "components/layout/footer";
import { PriceTransparency } from "components/price-transparency";
import { Reveal, RevealGroup, RevealItem } from "components/motion/reveal";
import { collectionHero, img } from "lib/data/catalog";
import { getProducts } from "lib/shopify";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  description:
    "Gallery-grade furniture, sourced direct from the ateliers that make it for the world's most coveted houses — without the markup.",
  openGraph: { type: "website" },
};

const CATEGORIES = [
  {
    handle: "living",
    title: "Living",
    copy: "Sofas, lounge chairs & occasional",
    span: "lg:col-span-6 lg:row-span-2",
  },
  {
    handle: "dining",
    title: "Dining",
    copy: "Tables & seating",
    span: "lg:col-span-6",
  },
  {
    handle: "bedroom",
    title: "Bedroom",
    copy: "Beds & rest",
    span: "lg:col-span-3",
  },
  {
    handle: "lighting",
    title: "Lighting",
    copy: "Sculptural light",
    span: "lg:col-span-3",
  },
];

export default async function HomePage() {
  const all = await getProducts({ sortKey: "BEST_SELLING" });
  const coveted = all.slice(0, 8);
  const cases = all
    .filter((p) => p.meta?.comparableAt && p.meta?.sourcingStory)
    .slice(0, 6);

  return (
    <>
      <Hero image={img("1618220179428-22790b461013", 2400)} />

      {/* Brand promise strip */}
      <section className="border-b border-sand bg-cream">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-y divide-sand px-4 md:grid-cols-4 md:divide-y-0 lg:px-8">
          {[
            [
              ReceiptPercentIcon,
              "Up to 70% less",
              "than the traditional retail price",
            ],
            [
              SparklesIcon,
              "The same ateliers",
              "that supply the design houses",
            ],
            [MoonIcon, "100-night trial", "live with it before you commit"],
            [
              TruckIcon,
              "White-glove delivery",
              "placed, assembled, complimentary",
            ],
          ].map(([Icon, title, body]) => {
            const I = Icon as typeof TruckIcon;
            return (
              <div
                key={title as string}
                className="flex flex-col items-center px-4 py-8 text-center"
              >
                <I className="h-7 w-7 text-brass" strokeWidth={1} />
                <p className="mt-3 font-serif text-lg text-ink md:text-xl">
                  {title as string}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-clay">
                  {body as string}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* The difference — the sourcing thesis */}
      <section className="mx-auto max-w-[1400px] px-4 py-24 lg:px-8 lg:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-clay">
            The Maison Noyer Difference
          </p>
          <h2 className="mx-auto mt-6 max-w-2xl font-serif text-4xl leading-[1.1] text-ink md:text-[3.25rem]">
            High design is not the same as a high price.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-walnut">
            Galleries rarely make their own furniture. We go straight to the
            makers, and skip the markup.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-3 lg:mt-20">
          {[
            [
              "Direct from the atelier",
              "The same workshops that supply the design houses.",
            ],
            [
              "The same materials",
              "Belgian linen, Carrara marble, solid oak — no substitutes.",
            ],
            [
              "None of the markup",
              "You pay for the craft, not the name on the tag.",
            ],
          ].map(([title, body], i) => (
            <RevealItem key={title}>
              <div className="border-t border-stone/40 pt-6">
                <span className="font-serif text-2xl text-brass">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-serif text-xl text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-walnut">
                  {body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Case in point — scrollable price comparisons */}
      <CaseInPoint products={cases} />

      {/* Honest pricing breakdown */}
      <PriceTransparency />

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

        <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[270px] lg:grid-cols-12 lg:gap-5">
          {CATEGORIES.map((cat) => (
            <RevealItem
              key={cat.handle}
              className={`min-h-[320px] lg:min-h-0 ${cat.span}`}
            >
              <Link
                href={`/search/${cat.handle}`}
                className="img-hover-zoom group relative block h-full w-full overflow-hidden bg-cream"
              >
                <Image
                  src={
                    collectionHero[cat.handle] ??
                    img("1618220179428-22790b461013")
                  }
                  alt={cat.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                <div className="pointer-events-none absolute inset-3 border border-bone/25" />
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-bone/70">
                    {cat.copy}
                  </p>
                  <h3 className="mt-1.5 font-serif text-3xl text-bone lg:text-4xl">
                    {cat.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-bone">
                    Explore
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Most coveted — horizontal carousel */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <Reveal className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-clay">
                Most Coveted
              </p>
              <h2 className="mt-4 font-serif text-4xl text-ink md:text-5xl">
                The pieces our clients live with
              </h2>
            </div>
            <p className="hidden shrink-0 pb-1 text-xs uppercase tracking-[0.18em] text-clay sm:block">
              Scroll to explore →
            </p>
          </Reveal>
          <Reveal>
            <CovetedCarousel products={coveted} />
          </Reveal>
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

      {/* Why clients trust us — editorial split, image on the opposite side */}
      <section className="bg-espresso py-24 text-bone lg:py-32">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <Reveal className="order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative mt-10 aspect-[3/4] overflow-hidden bg-forest-deep">
                <Image
                  src={img("1583847268964-b28dc8f51f92", 800)}
                  alt="A client's living room"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden bg-forest-deep">
                <Image
                  src={img("1615875605825-5eb9bb5d52ac", 800)}
                  alt="A Maison Noyer interior"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-2">
            <p className="text-xs uppercase tracking-[0.3em] text-brass-soft">
              Why clients trust us
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Loved by the people who live with it.
            </h2>
            <blockquote className="mt-6 font-serif text-2xl leading-snug text-bone/90">
              &ldquo;We sat on the $9,800 version the same week ours arrived.
              Honestly, we could not tell them apart.&rdquo;
            </blockquote>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-bone/55">
              Eleanor V. — Greenwich, CT · Verified buyer
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-bone/15 pt-6">
              {[
                ["4.9/5", "2,400+ reviews"],
                ["18,000+", "rooms furnished"],
                ["100 nights", "to decide at home"],
              ].map(([stat, label]) => (
                <div key={stat}>
                  <p className="font-serif text-2xl text-bone md:text-3xl">
                    {stat}
                  </p>
                  <p className="mt-1 text-[11px] leading-tight text-bone/55">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/sourcing"
              className="mt-9 inline-block border-b border-bone pb-1 text-xs font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:text-brass-soft"
            >
              Inside our client care
            </Link>
          </Reveal>
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

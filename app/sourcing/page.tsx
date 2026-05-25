import Footer from "components/layout/footer";
import { Reveal, RevealGroup, RevealItem } from "components/motion/reveal";
import { img } from "lib/data/catalog";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Our Sourcing",
  description:
    "How Maison Noyer brings gallery-grade furniture direct from the ateliers behind the icons — without the markup.",
};

export default function SourcingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[70vh] min-h-[480px] w-full items-end overflow-hidden">
        <Image
          src={img("1504148455328-c376907d081c", 2200)}
          alt="Inside one of our ateliers"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/10" />
        <div className="relative mx-auto w-full max-w-[1100px] px-4 pb-16 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-bone/80">
            Our Sourcing
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight text-bone md:text-7xl">
            The same makers. None of the markup.
          </h1>
        </div>
      </section>

      {/* Thesis */}
      <section className="mx-auto max-w-[820px] px-4 py-20 text-center lg:py-28">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-clay">
            The premise
          </p>
          <h2 className="mt-5 font-serif text-3xl leading-snug text-ink md:text-4xl">
            Most luxury furniture is not made by the brand on the label.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-walnut">
            It is made by specialist ateliers — family upholstery houses,
            quarry-side stone workshops, mills that have cut oak for
            generations. The brand commissions the piece, photographs it
            beautifully, and adds three to five times the cost for the name. We
            believe the craft is worth paying for. The name is not.
          </p>
        </Reveal>
      </section>

      {/* The process */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <Reveal className="mb-14 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-clay">
              How it works
            </p>
            <h2 className="mt-4 font-serif text-4xl text-ink md:text-5xl">
              Four steps, no shortcuts
            </h2>
          </Reveal>

          <RevealGroup className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "01",
                "We find the maker",
                "We track down the actual atelier behind a coveted design — often the very workshop that produces the licensed original — and build a direct relationship.",
              ],
              [
                "02",
                "We hold the spec",
                "Belgian flax linen, genuine Carrara marble, solid FSC oak, feather-down wraps. We specify the real materials and refuse the cheaper substitutes.",
              ],
              [
                "03",
                "We cut the chain",
                "No gallery, no licensing fee, no showroom rent, no distributor. The piece travels from the atelier toward your home, and nowhere else.",
              ],
              [
                "04",
                "We stand behind it",
                "A 100-night trial, white-glove delivery and assembly, and a lifetime warranty on every frame and joint we build.",
              ],
            ].map(([num, title, body]) => (
              <RevealItem key={num}>
                <div className="border-t border-stone/50 pt-6">
                  <p className="font-serif text-3xl text-brass">{num}</p>
                  <h3 className="mt-4 font-serif text-2xl text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-walnut">
                    {body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Materials editorial */}
      <section className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream">
            <Image
              src={img("1605117882932-f9e32b03fea9", 1000)}
              alt="Material detail"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xs uppercase tracking-[0.3em] text-clay">
            Materials we insist on
          </p>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-ink md:text-4xl">
            The cost is in the material and the labor — exactly where it should
            be.
          </h2>
          <ul className="mt-8 divide-y divide-sand border-t border-sand">
            {[
              ["Belgian flax linen", "Garment-dyed by the bolt, never a blend"],
              [
                "Carrara marble",
                "Quarried from the Tuscan basin, honed by hand",
              ],
              [
                "Solid FSC oak",
                "Milled from certified European forests — no MDF cores",
              ],
              ["American walnut", "Book-matched for grain, over a solid frame"],
              ["Feather-down", "Wrapped over high-resilience, CFC-free foam"],
            ].map(([label, body]) => (
              <li key={label} className="py-4">
                <p className="font-serif text-lg text-ink">{label}</p>
                <p className="mt-1 text-sm text-walnut">{body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Ateliers */}
      <section className="bg-espresso py-20 text-bone lg:py-28">
        <div className="mx-auto max-w-[1100px] px-4 text-center lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-brass-soft">
              Our ateliers
            </p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">
              A small circle of trusted workshops
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-bone/75">
              We work with a deliberately small group of family-run ateliers
              across Europe and Asia — the same workshops trusted by some of the
              most respected names in design. We pay fair rates, place real
              orders, and protect those relationships fiercely.
            </p>
          </Reveal>
          <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              ["Lombardy, Italy", "Upholstery & feather-down"],
              ["Porto, Portugal", "Bouclé & curved foam"],
              ["Bình Dương, Vietnam", "Joinery, weaving & molded shells"],
            ].map(([place, craft]) => (
              <RevealItem key={place}>
                <div className="border-t border-bone/15 pt-6">
                  <p className="font-serif text-2xl">{place}</p>
                  <p className="mt-2 text-sm text-bone/60">{craft}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Guarantees */}
      <section className="mx-auto max-w-[1400px] px-4 py-20 lg:px-8 lg:py-28">
        <Reveal className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-clay">
            Client care
          </p>
          <h2 className="mt-4 font-serif text-4xl text-ink md:text-5xl">
            A purchase this considered deserves real support
          </h2>
        </Reveal>
        <RevealGroup className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "100-night trial",
              "Live with your piece for 100 nights. If it's not right, return it within the trial window (return shipping applies).",
            ],
            [
              "White-glove delivery",
              "We deliver, place, assemble, and remove every scrap of packaging.",
            ],
            [
              "Lifetime warranty",
              "Every frame and joint we build is guaranteed for as long as you own it.",
            ],
            [
              "Personal specialists",
              "Real people who know furniture, on hand before and after you buy.",
            ],
          ].map(([title, body]) => (
            <RevealItem key={title}>
              <div className="h-full border border-sand p-7">
                <h3 className="font-serif text-xl text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-walnut">
                  {body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Trade CTA */}
      <section className="bg-cream">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center px-4 py-20 text-center lg:px-8 lg:py-24">
          <Reveal>
            <h2 className="font-serif text-3xl text-ink md:text-4xl">
              Designers & trade
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-walnut">
              We partner with interior designers, architects, and stagers with
              dedicated pricing, swatch libraries, and project support. Tell us
              about your practice and we'll be in touch.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/search"
                className="bg-ink px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:bg-walnut"
              >
                Browse the Collection
              </Link>
              <a
                href="mailto:trade@maisonnoyer.example"
                className="border border-ink px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-bone"
              >
                Apply for Trade
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}

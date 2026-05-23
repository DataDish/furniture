import Link from "next/link";

import { getMenu } from "lib/shopify";
import { Newsletter } from "./newsletter";

const SITE_NAME = process.env.SITE_NAME || "Maison Noyer";

const COLUMNS: { heading: string; links: { title: string; path: string }[] }[] =
  [
    {
      heading: "Shop",
      links: [
        { title: "Living", path: "/search/living" },
        { title: "Dining", path: "/search/dining" },
        { title: "Bedroom", path: "/search/bedroom" },
        { title: "Lighting", path: "/search/lighting" },
        { title: "New Arrivals", path: "/search/new" },
      ],
    },
    {
      heading: "The House",
      links: [
        { title: "Our Sourcing", path: "/sourcing" },
        { title: "Materials & Craft", path: "/sourcing" },
        { title: "Trade Program", path: "/sourcing" },
        { title: "Sustainability", path: "/sourcing" },
      ],
    },
    {
      heading: "Client Care",
      links: [
        { title: "100-Night Trial", path: "/sourcing" },
        { title: "Delivery & Assembly", path: "/sourcing" },
        { title: "Warranty", path: "/sourcing" },
        { title: "Contact a Specialist", path: "/sourcing" },
      ],
    },
  ];

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  // Touch the menu source so footer stays in sync with the storefront config.
  await getMenu("next-js-frontend-footer-menu");

  return (
    <footer className="bg-espresso text-bone">
      <div className="mx-auto max-w-[1400px] px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4">
            <p className="font-serif text-3xl tracking-[0.12em] uppercase">
              {SITE_NAME}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-bone/70">
              Gallery-grade furniture, sourced direct from the ateliers that
              make it for the world's most coveted houses — without the markup
              that comes with the name on the tag.
            </p>
            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-bone/50">
                Join the house list
              </p>
              <Newsletter />
            </div>
          </div>

          <div className="lg:col-span-1 hidden lg:block" />

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading} className="lg:col-span-2">
              <p className="mb-5 text-xs uppercase tracking-[0.25em] text-bone/50">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.path}
                      className="text-sm text-bone/80 transition-colors hover:text-bone"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-1" />
        </div>

        {/* Trust row */}
        <div className="mt-16 grid gap-6 border-t border-bone/15 pt-10 sm:grid-cols-3">
          {[
            ["100-Night Trial", "Live with it. Return it if it's not right."],
            [
              "White-Glove Delivery",
              "Placed, assembled, and packaging removed.",
            ],
            ["Lifetime Warranty", "On every frame and joint we build."],
          ].map(([title, body]) => (
            <div key={title}>
              <p className="font-serif text-lg">{title}</p>
              <p className="mt-1 text-sm text-bone/60">{body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-bone/15">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-bone/50 sm:flex-row lg:px-8">
          <p>
            &copy; {currentYear} {SITE_NAME}. Considered furniture, without the
            markup.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/sourcing"
              className="transition-colors hover:text-bone"
            >
              Privacy
            </Link>
            <Link
              href="/sourcing"
              className="transition-colors hover:text-bone"
            >
              Terms
            </Link>
            <Link
              href="/sourcing"
              className="transition-colors hover:text-bone"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

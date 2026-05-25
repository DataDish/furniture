import { ContactForm } from "components/contact-form";
import { PageShell } from "components/page-shell";

export const metadata = {
  title: "Contact Us",
  description:
    "Speak with a Maison Noyer furniture specialist about a piece, an order, or anything else.",
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="We're here to help"
      title="Contact us"
      intro="Questions about a piece, an order, materials, or delivery? Our furniture specialists are happy to help — we reply within one business day."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="text-sm leading-relaxed text-walnut">
          <h2 className="font-serif text-xl text-ink">Reach us directly</h2>
          <dl className="mt-5 space-y-5">
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-clay">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  href="mailto:hello@maisonnoyer.example"
                  className="border-b border-clay hover:text-ink"
                >
                  hello@maisonnoyer.example
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-clay">
                Trade & projects
              </dt>
              <dd className="mt-1">
                <a
                  href="mailto:trade@maisonnoyer.example"
                  className="border-b border-clay hover:text-ink"
                >
                  trade@maisonnoyer.example
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-clay">
                Specialist hours
              </dt>
              <dd className="mt-1">Monday–Friday, 9am–6pm ET</dd>
            </div>
          </dl>
        </div>

        <ContactForm topic="Contact" />
      </div>
    </PageShell>
  );
}

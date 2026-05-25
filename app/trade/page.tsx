import { ContactForm } from "components/contact-form";
import { ContentSections, PageShell } from "components/page-shell";

export const metadata = {
  title: "Trade Program",
  description:
    "Maison Noyer partners with interior designers, architects, and stagers with dedicated pricing, swatch libraries, and project support.",
};

export default function TradePage() {
  return (
    <PageShell
      eyebrow="For the trade"
      title="A partner for your projects."
      intro="We work with interior designers, architects, developers, and stagers — with dedicated pricing, materials support, and a specialist who knows your projects."
    >
      <ContentSections
        sections={[
          {
            heading: "Program benefits",
            body: [
              "Dedicated trade pricing across the full collection.",
              "A complimentary swatch library so you can specify with confidence.",
              "A single point of contact for quotes, lead times, and logistics.",
              "White-glove delivery and installation coordination on every order.",
            ],
          },
          {
            heading: "Who it's for",
            body: "Interior designers, architects, real-estate stagers, hospitality and multi-unit residential projects. If you specify furniture for clients, the trade program is for you.",
          },
          {
            heading: "Custom & volume",
            body: "Need a custom size, a bulk run for a project, or a bespoke finish? We commission directly from our ateliers and can scope custom and volume orders to your timeline.",
          },
        ]}
      />

      <div className="mt-14 border-t border-sand pt-12">
        <h2 className="font-serif text-2xl text-ink">Apply for trade</h2>
        <p className="mt-3 text-base leading-relaxed text-walnut">
          Tell us about your practice and we'll set up your account.
        </p>
        <div className="mt-8">
          <ContactForm
            topic="Trade Application"
            messageLabel="About your practice"
            messagePlaceholder="Your studio or firm, the kind of projects you take on, and your website if you have one…"
            cta="Apply for trade"
          />
        </div>
      </div>
    </PageShell>
  );
}

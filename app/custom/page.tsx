import { ContactForm } from "components/contact-form";
import { ContentSections, PageShell } from "components/page-shell";

export const metadata = {
  title: "Custom Sourcing",
  description:
    "Looking for a specific piece, a custom size, or something you saw elsewhere? Tell us what you want and we'll try to source it — direct from the maker.",
};

export default function CustomSourcingPage() {
  return (
    <PageShell
      eyebrow="Custom Sourcing"
      title="Looking for something specific? We'll try to source it."
      intro="A piece you've fallen for, a custom size for an awkward room, a material you can't find anywhere — tell us what you're after. We work directly with ateliers and can often commission it for you."
    >
      <ContentSections
        sections={[
          {
            heading: "What we can do",
            body: [
              "Because we work hand-in-hand with the workshops that produce for the world's most coveted design houses, we can often commission a piece to your specification — a particular silhouette, a custom dimension, a specific fabric, marble, or wood.",
              "Send us a reference (a photo, a link, a sketch, or just a description) and we'll tell you honestly whether we can make it happen.",
            ],
          },
          {
            heading: "An honest note on price",
            body: "We can't promise that every custom request will come in below the market — some pieces are genuinely expensive to make well. What we can promise is transparency: we'll quote you the real cost of materials and craftsmanship, with none of the gallery markup, and very often that means a meaningfully better price.",
          },
          {
            heading: "How it works",
            body: [
              "1. Tell us what you're looking for using the form below.",
              "2. A specialist reviews your request and reaches out, usually within one business day.",
              "3. We confirm feasibility, materials, lead time, and a transparent quote before anything is committed.",
            ],
          },
        ]}
      />

      <div className="mt-14 border-t border-sand pt-12">
        <h2 className="font-serif text-2xl text-ink">Tell us what you want</h2>
        <p className="mt-3 text-base leading-relaxed text-walnut">
          The more detail the better — dimensions, materials, a reference image
          or link, and your timeline.
        </p>
        <div className="mt-8">
          <ContactForm
            topic="Custom Sourcing"
            messageLabel="What are you looking for?"
            messagePlaceholder="Describe the piece, include any dimensions, materials, or a reference link…"
            cta="Submit request"
          />
        </div>
      </div>
    </PageShell>
  );
}

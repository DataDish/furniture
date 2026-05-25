import { ContentSections, PageShell } from "components/page-shell";
import Link from "next/link";

export const metadata = {
  title: "100-Night Trial",
  description:
    "Live with your Maison Noyer pieces for 100 nights. If it's not right, return it within the trial window.",
};

export default function TrialPage() {
  return (
    <PageShell
      eyebrow="Buy with confidence"
      title="The 100-night trial"
      intro="Furniture this considered deserves to be lived with. Take 100 nights to be sure — if a piece isn't right for your home, you can return it."
    >
      <ContentSections
        sections={[
          {
            heading: "How it works",
            body: [
              "Your 100 nights begin the day your order is delivered. Sit in it, sleep on it, move it around — really live with the piece.",
              "If it isn't right, simply start a return within the 100-night window and we'll guide you through the rest.",
            ],
          },
          {
            heading: "Returns & refunds",
            body: [
              "We're happy to accept returns within the trial window. We'll arrange the return shipping to our US warehouse for you — and the cost of that return shipping is the customer's responsibility.",
              "Once your piece arrives back in original, resellable condition, we'll refund the full purchase price. Original shipping and return shipping costs are non-refundable.",
            ],
          },
          {
            heading: "Condition",
            body: "Normal trial use is completely expected. Pieces should be returned in clean, undamaged, resellable condition with any original fixings. Significant damage, staining, or modification may reduce the refund.",
          },
          {
            heading: "Made-to-order pieces",
            body: "Most of our collection is covered by the trial. Bespoke or custom-commissioned pieces made to your specification are produced just for you and may be final sale — we'll always confirm this with you before you order.",
          },
        ]}
      />

      <div className="mt-12 border-t border-sand pt-10">
        <p className="text-base leading-relaxed text-walnut">
          Ready to start a return, or have a question first?{" "}
          <Link href="/contact" className="border-b border-clay hover:text-ink">
            Contact a specialist
          </Link>
          .
        </p>
      </div>
    </PageShell>
  );
}

import { ContentSections, PageShell } from "components/page-shell";
import Link from "next/link";

export const metadata = {
  title: "Warranty",
  description:
    "Every frame and joint Maison Noyer builds is covered by a lifetime warranty for as long as you own the piece.",
};

export default function WarrantyPage() {
  return (
    <PageShell
      eyebrow="Built to last"
      title="Lifetime warranty"
      intro="We build furniture to be handed down, not replaced. Every frame and joint we make is guaranteed against manufacturing defects for as long as you own it."
    >
      <ContentSections
        sections={[
          {
            heading: "What's covered",
            body: [
              "Structural frames and joinery are covered for the lifetime of the original owner against defects in materials and workmanship.",
              "Mechanisms and hardware (such as soft-close glides and reclining mechanisms) are covered for three years.",
            ],
          },
          {
            heading: "What's not covered",
            body: [
              "Normal wear and the natural patina of materials — leather softening, wood and stone developing character, fabric relaxing — are part of how these pieces are meant to age.",
              "Damage from misuse, accidents, improper cleaning, or exposure to extreme conditions is not covered.",
              "Variation in natural materials (grain, veining, and tone) is a feature of genuine wood, leather, and stone, not a defect.",
            ],
          },
          {
            heading: "How to make a claim",
            body: "Reach out with your order details and a few photos of the issue. If it's a covered defect, we'll repair, replace the component, or replace the piece — whichever makes it right.",
          },
        ]}
      />

      <div className="mt-12 border-t border-sand pt-10">
        <p className="text-base leading-relaxed text-walnut">
          Need to make a claim?{" "}
          <Link href="/contact" className="border-b border-clay hover:text-ink">
            Contact a specialist
          </Link>{" "}
          and we'll take care of you.
        </p>
      </div>
    </PageShell>
  );
}

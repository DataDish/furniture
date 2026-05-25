import { ContentSections, PageShell } from "components/page-shell";
import Link from "next/link";

export const metadata = {
  title: "Materials & Craft",
  description:
    "The materials and craftsmanship behind every Maison Noyer piece — genuine, specified to the same standard as the design houses.",
};

export default function MaterialsPage() {
  return (
    <PageShell
      eyebrow="Materials & Craft"
      title="The cost is in the material and the labor."
      intro="We specify the same genuine materials as the design houses we're inspired by — and never substitute a cheaper version to hit a price."
    >
      <ContentSections
        sections={[
          {
            heading: "Belgian flax linen",
            body: "Garment-dyed by the bolt for a soft, lived-in hand. Always 100% flax linen — never a synthetic blend dressed up to look like it.",
          },
          {
            heading: "Genuine Carrara marble",
            body: "Quarried from the Tuscan basin and honed by hand. Every top is selected for its veining, sealed against stains, and unmistakably real stone — heavy, cool, and one of a kind.",
          },
          {
            heading: "Solid FSC oak & walnut",
            body: "Milled from certified forests and finished with plant-based oils. Solid timber and book-matched veneers over solid frames — never MDF cores pretending to be wood.",
          },
          {
            heading: "Feather-down & 8-way hand-tied seating",
            body: "Cushions are wrapped in feather-down over high-resilience, CFC-free foam, and our seating is built on kiln-dried hardwood frames with hand-tied suspension for comfort that lasts.",
          },
          {
            heading: "The hands behind it",
            body: "Each piece is made by the family-run ateliers that supply the world's most celebrated design houses. A single upholsterer wraps and tufts a sofa; a trained weaver spends ninety minutes on a single chair seat. The craft is real — we simply let you pay for it directly.",
          },
        ]}
      />

      <div className="mt-12 border-t border-sand pt-10">
        <p className="text-base leading-relaxed text-walnut">
          Want to see and feel a material before you commit?{" "}
          <Link href="/contact" className="border-b border-clay hover:text-ink">
            Request a swatch box
          </Link>
          .
        </p>
      </div>
    </PageShell>
  );
}

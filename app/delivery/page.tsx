import { ContentSections, PageShell } from "components/page-shell";

export const metadata = {
  title: "Delivery & Assembly",
  description:
    "Complimentary white-glove delivery on every Maison Noyer order — placed, assembled, and packaging removed.",
};

export default function DeliveryPage() {
  return (
    <PageShell
      eyebrow="White-glove service"
      title="Delivery & assembly"
      intro="Every order includes complimentary white-glove delivery. Our team brings your piece into the room of your choice, assembles it, and takes the packaging away."
    >
      <ContentSections
        sections={[
          {
            heading: "What's included",
            body: [
              "Complimentary white-glove delivery on every order — no minimums.",
              "We carry the piece into your home, place it in the room of your choice, assemble it, and remove all packaging.",
              "Smaller accessories and lighting may ship via standard parcel carrier.",
            ],
          },
          {
            heading: "Lead times",
            body: [
              "In-stock pieces typically ship within one week.",
              "Made-to-order pieces are crafted for you and generally ship in 4–8 weeks; the estimate is noted on each product page.",
              "Once your piece reaches the local delivery hub, our team will call to schedule a delivery window that suits you.",
            ],
          },
          {
            heading: "Where we deliver",
            body: "We currently offer white-glove delivery across the contiguous United States. If you're outside the lower 48, contact us before ordering and we'll let you know what's possible.",
          },
          {
            heading: "Before your delivery",
            body: "Please make sure the piece will fit through doorways, hallways, stairwells, and elevators. If you're unsure, reach out and we'll help you check dimensions in advance.",
          },
        ]}
      />
    </PageShell>
  );
}

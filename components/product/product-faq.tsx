import { Reveal } from "components/motion/reveal";
import { Product } from "lib/shopify/types";
import { Accordion, type AccordionItem } from "./accordion";

// Brand-wide FAQs shown on every PDP unless a product overrides them via the
// Shopify `details.faqs` metafield.
const DEFAULT_FAQS: { question: string; answer: string }[] = [
  {
    question: "How can your prices be so much lower?",
    answer:
      "We commission our pieces directly from the same family-run ateliers that produce for the world's most celebrated design houses. By removing the gallery, the showroom, the licensing fee, and the distributor, you pay for the materials and the craftsmanship, and nothing for the name on the tag.",
  },
  {
    question: "Is the quality really the same?",
    answer:
      "Yes. We hold the exact specifications: the same Belgian linen, genuine Carrara marble, solid FSC oak, and feather-down construction. We never substitute a cheaper material to hit a price.",
  },
  {
    question: "How does delivery work?",
    answer:
      "Every order includes complimentary white-glove delivery. Our team brings the piece into your home, assembles it, and removes all packaging. Made-to-order pieces typically ship in 4–8 weeks; in-stock pieces ship within a week.",
  },
  {
    question: "What is the 100-night trial?",
    answer:
      "Live with your piece for 100 nights. If it isn't right for your space, return it within the trial window for a full refund of the purchase price. We arrange the return shipping to our US warehouse for you, and the cost of that return shipping is the customer's responsibility.",
  },
  {
    question: "Can I order material or fabric swatches?",
    answer:
      "Absolutely. Request a swatch box from any product page or by contacting a furniture specialist, and we'll send samples of the available finishes before you commit.",
  },
  {
    question: "What does the warranty cover?",
    answer:
      "Every frame and joint we build is covered by a lifetime warranty for as long as you own the piece. Reach out and we'll make it right.",
  },
];

export function ProductFaq({ product }: { product: Product }) {
  const faqs = product.meta?.faqs?.length ? product.meta.faqs : DEFAULT_FAQS;

  const items: AccordionItem[] = faqs.map((f) => ({
    title: f.question,
    content: <p>{f.answer}</p>,
  }));

  // JSON-LD for FAQ rich results
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="mx-auto max-w-[1100px] px-4 py-20 lg:px-8 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-clay">
            Good to know
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-ink md:text-4xl">
            Questions, answered.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-walnut">
            Still wondering about something? Our furniture specialists are happy
            to help before you commit.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion items={items} defaultOpen={null} />
        </Reveal>
      </div>
    </section>
  );
}

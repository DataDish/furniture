import { ContentSections, PageShell } from "components/page-shell";

export const metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of Maison Noyer and your orders.",
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of service"
      intro="These terms cover your use of our site and the purchases you make with us."
    >
      <ContentSections
        sections={[
          {
            heading: "Orders & pricing",
            body: "All orders are subject to acceptance and availability. We make every effort to display accurate pricing and product information; in the rare event of an error, we may correct it and will contact you before proceeding.",
          },
          {
            heading: "Payment",
            body: "Payment is processed securely at checkout. Title and risk of loss pass to you upon delivery.",
          },
          {
            heading: "Returns",
            body: "Most pieces are covered by our 100-night trial. Return shipping is the customer's responsibility, and refunds are issued for pieces returned in original, resellable condition. See the 100-Night Trial page for full details.",
          },
          {
            heading: "Warranty",
            body: "Our products are covered by the warranty described on our Warranty page. Natural variation in materials is expected and is not a defect.",
          },
          {
            heading: "Intellectual property",
            body: "All content on this site — text, imagery, and design — is owned by Maison Noyer or its licensors and may not be reproduced without permission.",
          },
          {
            heading: "Contact",
            body: "Questions about these terms? Email hello@maisonnoyer.example.",
          },
        ]}
      />
      <p className="mt-12 border-t border-sand pt-8 text-sm italic text-clay">
        This is a plain-language summary for the storefront and is not a
        substitute for legal advice. Please have your final terms reviewed by
        counsel before launch.
      </p>
    </PageShell>
  );
}

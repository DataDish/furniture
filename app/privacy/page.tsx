import { ContentSections, PageShell } from "components/page-shell";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Maison Noyer collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy policy"
      intro="We respect your privacy and only collect what we need to serve you well. This is a summary of how we handle your information."
    >
      <ContentSections
        sections={[
          {
            heading: "Information we collect",
            body: "We collect the details you provide when you place an order, create an account, join our list, or contact us — such as your name, email, shipping address, and order history — along with standard analytics about how our site is used.",
          },
          {
            heading: "How we use it",
            body: "To process and deliver your orders, provide customer care, send updates and marketing you've opted into, prevent fraud, and improve our products and site. We never sell your personal information.",
          },
          {
            heading: "Sharing",
            body: "We share information only with the partners who help us operate — payment processors, delivery carriers, email and analytics providers — and only as needed to provide our service, under appropriate safeguards.",
          },
          {
            heading: "Your choices",
            body: "You can unsubscribe from marketing at any time, and you may request access to, correction of, or deletion of your personal data by contacting us.",
          },
          {
            heading: "Contact",
            body: "Questions about privacy? Email privacy@maisonnoyer.example and we'll help.",
          },
        ]}
      />
      <p className="mt-12 border-t border-sand pt-8 text-sm italic text-clay">
        This is a plain-language summary for the storefront and is not a
        substitute for legal advice. Please have your final privacy policy
        reviewed by counsel before launch.
      </p>
    </PageShell>
  );
}

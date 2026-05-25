import { ContentSections, PageShell } from "components/page-shell";

export const metadata = {
  title: "Accessibility",
  description:
    "Maison Noyer is committed to making our storefront usable for everyone.",
};

export default function AccessibilityPage() {
  return (
    <PageShell
      eyebrow="Our commitment"
      title="Accessibility"
      intro="We want every visitor to be able to browse and shop Maison Noyer with ease, and we're continually improving toward that goal."
    >
      <ContentSections
        sections={[
          {
            heading: "Our approach",
            body: "We aim to meet the WCAG 2.1 AA standard. That means clear color contrast, keyboard-navigable menus and forms, descriptive alt text on imagery, and respect for reduced-motion preferences.",
          },
          {
            heading: "Ongoing work",
            body: "Accessibility is never finished. We regularly review the site and address issues as we find them — and we'd genuinely like to hear from you if something gets in your way.",
          },
          {
            heading: "Tell us",
            body: "If you encounter a barrier or have a suggestion, email accessibility@maisonnoyer.example. We take every message seriously and will work with you directly.",
          },
        ]}
      />
    </PageShell>
  );
}

import { PageShell } from "components/page-shell";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Account",
  description:
    "Sign in to your Maison Noyer account to view orders and details.",
};

// Sends customers to Shopify's secure, hosted account pages (login, orders,
// addresses, returns). Override the destination with SHOPIFY_ACCOUNT_URL if you
// use a custom account domain.
function accountUrl(): string | null {
  const explicit = process.env.SHOPIFY_ACCOUNT_URL;
  if (explicit) return explicit;

  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) return null;
  const base = domain.startsWith("http") ? domain : `https://${domain}`;
  return `${base}/account`;
}

export default function AccountPage() {
  const url = accountUrl();
  if (url) redirect(url);

  // Local/demo fallback (no Shopify configured yet).
  return (
    <PageShell
      eyebrow="Your account"
      title="Sign in"
      intro="Accounts are handled securely by Shopify. Once the store is connected, this page takes you straight to your account — orders, addresses, and returns, all in one place."
    >
      <div className="border border-sand bg-cream p-10 text-center">
        <p className="font-serif text-2xl text-ink">
          Accounts are coming online
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-walnut">
          Customer accounts go live the moment the store is connected to
          Shopify. In the meantime, our specialists are happy to help with any
          order.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block bg-ink px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:bg-forest"
        >
          Contact a specialist
        </Link>
      </div>
    </PageShell>
  );
}

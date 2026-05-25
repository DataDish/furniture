"use client";

import { Product } from "lib/shopify/types";
import Script from "next/script";
import { useEffect } from "react";
import { Reviews } from "./reviews";

const SHOP = process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN;

// Pull the trailing numeric id out of a Shopify GID (gid://shopify/Product/123).
function numericId(gid: string): string | undefined {
  const match = gid.match(/(\d+)\s*$/);
  return match?.[1];
}

/**
 * Renders the Judge.me review widget on the PDP when Judge.me is configured
 * (NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN + NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN and a real
 * Shopify product id). Otherwise it falls back to the built-in reviews block so
 * the page still looks complete in local/demo mode.
 */
export function JudgeMeReviews({ product }: { product: Product }) {
  const id = numericId(product.id);
  const enabled = Boolean(SHOP && TOKEN && id);

  useEffect(() => {
    if (!enabled) return;
    // Re-render the widget on client-side navigation between PDPs.
    const jdgm = (window as unknown as { jdgm?: { docReady?: () => void } })
      .jdgm;
    try {
      jdgm?.docReady?.();
    } catch {
      /* widget not ready yet — the preloader will render on load */
    }
  }, [enabled, product.id]);

  if (!enabled) {
    return <Reviews product={product} />;
  }

  return (
    <section id="reviews" className="scroll-mt-32 bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-[1100px] px-4 lg:px-8">
        <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-clay">
          Client reviews
        </p>

        <Script id="judgeme-settings" strategy="afterInteractive">
          {`window.jdgmSettings = { shop_domain: "${SHOP}", platform: "shopify", public_token: "${TOKEN}" };`}
        </Script>
        <Script
          src="https://cdn.judge.me/widget_preloader.js"
          strategy="afterInteractive"
        />

        <div
          className="jdgm-widget jdgm-review-widget"
          data-id={id}
          data-product-title={product.title}
        />
      </div>
    </section>
  );
}

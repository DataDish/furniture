"use client";

import { Product } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { createElement } from "react";

// Real Shopify variant GIDs look like gid://shopify/ProductVariant/123456789.
// The local demo catalog uses non-numeric ids, so this naturally renders
// nothing until the store is connected to Shopify.
function numericVariantId(gid: string): string | undefined {
  const last = gid.split("/").pop() ?? "";
  return /^\d+$/.test(last) ? last : undefined;
}

/**
 * Shop Pay Installments banner ("Pay in installments with Shop Pay").
 * Uses Shopify's official <shopify-payment-terms> web component + shop-js so the
 * displayed terms and disclosures are accurate and compliant. Requires Shop Pay
 * Installments to be enabled in Shopify Payments.
 */
export function ShopPayInstallments({ product }: { product: Product }) {
  const searchParams = useSearchParams();

  const variant =
    product.variants.find((v) =>
      v.selectedOptions.every(
        (o) => o.value === searchParams.get(o.name.toLowerCase()),
      ),
    ) ?? (product.variants.length === 1 ? product.variants[0] : undefined);

  const id = variant ? numericVariantId(variant.id) : undefined;
  if (!id) return null;

  const priceCents = Math.round(
    Number(product.priceRange.maxVariantPrice.amount) * 100,
  );

  const meta = JSON.stringify({
    type: "product",
    variants: [{ id: Number(id), price: priceCents, available: true }],
  });

  return (
    <div className="mt-4 min-h-[1.5rem] text-sm text-walnut">
      {createElement("shopify-payment-terms", {
        key: id,
        "variant-id": id,
        "shopify-meta": meta,
      })}
      <Script
        id="shop-pay-installments"
        src="https://cdn.shopify.com/shopifycloud/shop-js/modules/installments/page-mount.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

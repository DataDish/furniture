"use client";

import type { Product } from "lib/shopify/types";
import Image from "next/image";
import { toast } from "sonner";
import { addItem } from "./actions";
import { useCart } from "./cart-context";

const usd0 = (n: string | number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));

export function CartUpsells() {
  const { upsells, cart, addCartItem } = useCart();
  if (!upsells?.length) return null;

  const inCart = new Set(
    (cart?.lines ?? []).map((l) => l.merchandise.product.handle),
  );
  const items = upsells.filter((p) => !inCart.has(p.handle)).slice(0, 2);
  if (!items.length) return null;

  return (
    <div className="border-t border-sand pt-4">
      <p className="mb-3 text-xs uppercase tracking-[0.18em] text-clay">
        Complete the room
      </p>
      <ul className="space-y-3">
        {items.map((product) => {
          const variant = product.variants[0];
          const price = product.priceRange.maxVariantPrice.amount;
          return (
            <li key={product.handle} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-sand bg-cream">
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-sm leading-tight text-ink">
                  {product.title}
                </p>
                <p className="text-xs text-clay">{usd0(price)}</p>
              </div>
              <form
                action={async () => {
                  if (!variant) return;
                  addCartItem(variant, product);
                  toast.success(`${product.title} added to your cart`);
                  await addItem(null, variant.id);
                }}
              >
                <button
                  type="submit"
                  className="border border-ink px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink hover:text-bone"
                >
                  Add
                </button>
              </form>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

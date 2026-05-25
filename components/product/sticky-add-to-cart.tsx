"use client";

import { AddToCart } from "components/cart/add-to-cart";
import clsx from "clsx";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import { useEffect, useState } from "react";

const usd0 = (n: string | number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));

export function StickyAddToCart({ product }: { product: Product }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom =
        window.innerHeight + y >= document.documentElement.scrollHeight - 240;
      setShow(y > 500 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const price = product.priceRange.maxVariantPrice.amount;
  const comparable = product.meta?.comparableAt?.amount;

  return (
    <div
      className={clsx(
        "fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-bone/95 backdrop-blur-md transition-transform duration-300",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative hidden h-12 w-12 shrink-0 overflow-hidden bg-cream sm:block">
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-serif text-base leading-tight text-ink">
              {product.title}
            </p>
            <p className="flex items-center gap-2 text-sm text-ink">
              {usd0(price)}
              {comparable ? (
                <span className="text-xs text-stone line-through">
                  {usd0(comparable)}
                </span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="w-40 shrink-0 sm:w-60">
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
}

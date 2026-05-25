"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const usd0 = (n: string | number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));

function Slide({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <div className="w-[88%] shrink-0 snap-center sm:w-[90%] lg:w-[92%]">
      <div className="grid overflow-hidden rounded-3xl bg-espresso text-bone lg:grid-cols-2">
        <div className="relative min-h-[300px] lg:min-h-[520px]">
          <Image
            src={product.images[1]?.url ?? product.featuredImage.url}
            alt={product.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 36vw, 86vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-12 lg:px-14 lg:py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-brass-soft">
            Case in point
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
            {product.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-bone/75">
            {product.meta?.sourcingStory}
          </p>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-bone/50">
                Traditional retail
              </p>
              <p className="mt-2 font-serif text-3xl leading-none text-bone/50 line-through md:text-4xl">
                {usd0(product.meta?.comparableAt?.amount ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brass-soft">
                Maison Noyer
              </p>
              <p className="mt-2 font-serif text-3xl leading-none text-bone md:text-4xl">
                {usd0(product.priceRange.maxVariantPrice.amount)}
              </p>
            </div>
          </div>

          <Link
            href={`/product/${product.handle}`}
            className="mt-9 inline-block w-full bg-bone px-8 py-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-cream sm:w-max sm:text-left"
          >
            View the {product.title}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CaseInPoint({ products }: { products: Product[] }) {
  const count = products.length;
  const loop = count > 1;
  const trackRef = useRef<HTMLDivElement>(null);
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);

  // Triple the slides so the user can scroll endlessly in both directions.
  const slides = loop ? [...products, ...products, ...products] : products;

  const stride = () => {
    const el = trackRef.current;
    if (!el || el.children.length < 2) return el?.clientWidth ?? 0;
    return (
      (el.children[1] as HTMLElement).offsetLeft -
      (el.children[0] as HTMLElement).offsetLeft
    );
  };

  // Find the slide whose center is nearest the viewport center.
  const nearestIndex = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const centerX = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const c = el.children[i] as HTMLElement;
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - centerX);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  };

  // Start centered on the middle copy.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !loop) return;
    const center = (child: HTMLElement) =>
      child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2;
    const mid = el.children[count] as HTMLElement | undefined;
    if (mid) el.scrollLeft = center(mid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop, count]);

  const recenter = () => {
    const el = trackRef.current;
    if (!el || !loop) return;
    const i = nearestIndex();
    const setStride = stride() * count;
    if (i < count) el.scrollLeft += setStride;
    else if (i >= count * 2) el.scrollLeft -= setStride;
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setActive(((nearestIndex() % count) + count) % count);
    if (settleRef.current) clearTimeout(settleRef.current);
    settleRef.current = setTimeout(recenter, 140);
  };

  const go = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * stride(), behavior: "smooth" });
  };

  if (!count) return null;

  const arrow =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-stone/40 bg-bone text-ink shadow-sm transition-colors hover:bg-cream";

  return (
    <section className="overflow-hidden bg-cream py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1700px]">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[6%] pb-2 lg:gap-5 lg:px-[4%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((product, i) => (
            <Slide
              key={`${product.handle}-${i}`}
              product={product}
              priority={i === count}
            />
          ))}
        </div>

        {loop ? (
          <>
            <button
              type="button"
              aria-label="Previous case"
              onClick={() => go(-1)}
              className={clsx(arrow, "left-3 lg:left-6")}
            >
              <ChevronLeftIcon className="h-5" />
            </button>
            <button
              type="button"
              aria-label="Next case"
              onClick={() => go(1)}
              className={clsx(arrow, "right-3 lg:right-6")}
            >
              <ChevronRightIcon className="h-5" />
            </button>

            <div className="mt-8 flex justify-center gap-2">
              {products.map((product, i) => (
                <button
                  key={product.handle}
                  type="button"
                  aria-label={`Go to case ${i + 1}`}
                  onClick={() => {
                    const el = trackRef.current;
                    if (!el) return;
                    el.scrollBy({
                      left: (i - active) * stride(),
                      behavior: "smooth",
                    });
                  }}
                  className={clsx(
                    "h-1.5 rounded-full transition-all",
                    i === active ? "w-6 bg-ink" : "w-1.5 bg-stone/50",
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

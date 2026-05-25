"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Stars } from "components/product/stars";
import clsx from "clsx";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const usd0 = (n: string | number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));

function CardImages({
  images,
  href,
  alt,
  priority,
}: {
  images: { url: string; altText: string }[];
  href: string;
  alt: string;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (delta: number) => setIndex((index + delta + count) % count);

  return (
    <div className="group/img relative aspect-[4/5] w-full overflow-hidden bg-cream">
      <Link href={href} prefetch className="block h-full w-full">
        <Image
          key={images[index]!.url}
          src={images[index]!.url}
          alt={images[index]!.altText || alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, 85vw"
          className="animate-[fadeIn_0.4s_ease] object-cover"
        />
      </Link>

      {count > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-sand bg-bone/85 text-ink opacity-0 backdrop-blur-sm transition-opacity hover:bg-bone group-hover/img:opacity-100"
          >
            <ChevronLeftIcon className="h-4" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-sand bg-bone/85 text-ink opacity-0 backdrop-blur-sm transition-opacity hover:bg-bone group-hover/img:opacity-100"
          >
            <ChevronRightIcon className="h-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((image, i) => (
              <button
                key={image.url}
                type="button"
                aria-label={`Image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={clsx(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-5 bg-bone" : "w-1.5 bg-bone/60",
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function CovetedCarousel({ products }: { products: Product[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 lg:-mx-8 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {products.map((product, i) => {
        const href = `/product/${product.handle}`;
        const price = product.priceRange.maxVariantPrice.amount;
        const comparable = product.meta?.comparableAt?.amount;
        const saving =
          comparable && Number(comparable) > Number(price)
            ? Number(comparable) - Number(price)
            : null;
        const savingPct =
          comparable && saving
            ? Math.round((saving / Number(comparable)) * 100)
            : null;
        const rating = product.meta?.rating;

        return (
          <div
            key={product.handle}
            className="group w-[82%] flex-none snap-start sm:w-[46%] lg:w-[31%] xl:w-[23.5%]"
          >
            <CardImages
              images={product.images}
              href={href}
              alt={product.title}
              priority={i < 3}
            />

            <Link href={href} prefetch className="mt-4 block">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {product.meta?.category ? (
                    <p className="text-[10px] uppercase tracking-[0.22em] text-clay">
                      {product.meta.category}
                    </p>
                  ) : null}
                  <h3 className="mt-1 font-serif text-lg leading-snug text-ink transition-colors group-hover:text-clay">
                    {product.title}
                  </h3>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm text-ink">{usd0(price)}</p>
                  {comparable ? (
                    <p className="text-xs text-stone line-through">
                      {usd0(comparable)}
                    </p>
                  ) : null}
                </div>
              </div>

              {rating ? (
                <div className="mt-2 flex items-center gap-1.5">
                  <Stars rating={rating} size="h-3.5 w-3.5" />
                  <span className="text-xs text-clay">
                    {product.meta?.reviewCount
                      ? `${rating} (${product.meta.reviewCount})`
                      : rating}
                  </span>
                </div>
              ) : null}

              {saving && savingPct ? (
                <p className="mt-2 text-xs font-medium text-sage">
                  Save {usd0(saving)} ({savingPct}%) vs. traditional retail
                </p>
              ) : null}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

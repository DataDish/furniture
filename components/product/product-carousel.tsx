"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

export function ProductCarousel({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const [index, setIndex] = useState(0);
  if (!images.length) return null;

  const count = images.length;
  const go = (delta: number) => setIndex((index + delta + count) % count);

  return (
    <div className="lg:sticky lg:top-40">
      <div className="group relative aspect-[4/5] w-full overflow-hidden bg-cream">
        <Image
          key={images[index]!.src}
          src={images[index]!.src}
          alt={images[index]!.altText}
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="animate-[fadeIn_0.5s_ease] object-cover"
        />

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-sand bg-bone/85 text-ink opacity-0 backdrop-blur-sm transition-opacity hover:bg-bone group-hover:opacity-100"
            >
              <ChevronLeftIcon className="h-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(1)}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-sand bg-bone/85 text-ink opacity-0 backdrop-blur-sm transition-opacity hover:bg-bone group-hover:opacity-100"
            >
              <ChevronRightIcon className="h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={clsx(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-6 bg-bone" : "w-1.5 bg-bone/60",
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                aria-label={`View image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={clsx(
                  "relative aspect-square w-full overflow-hidden bg-cream transition-opacity",
                  i === index
                    ? "ring-1 ring-ink"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={image.src}
                  alt={image.altText}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

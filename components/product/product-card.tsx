import clsx from "clsx";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import { Stars } from "./stars";

function formatUSD(amount: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 640px) 50vw, 100vw",
  className,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
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
  const reviewCount = product.meta?.reviewCount ?? 0;

  return (
    <Link
      href={`/product/${product.handle}`}
      prefetch={true}
      className={clsx("group block", className)}
    >
      <div className="img-hover-zoom relative aspect-[4/5] w-full overflow-hidden bg-cream">
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>

      <div className="mt-4">
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
            <p className="text-sm text-ink">{formatUSD(price)}</p>
            {comparable ? (
              <p className="text-xs text-stone line-through">
                {formatUSD(comparable)}
              </p>
            ) : null}
          </div>
        </div>

        {rating ? (
          <div className="mt-2 flex items-center gap-1.5">
            <Stars rating={rating} size="h-3.5 w-3.5" />
            <span className="text-xs text-clay">
              {reviewCount > 0 ? `${rating} (${reviewCount})` : rating}
            </span>
          </div>
        ) : null}

        {product.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-walnut">
            {product.description}
          </p>
        ) : null}

        {saving && savingPct ? (
          <p className="mt-2 text-xs font-medium text-sage">
            Save {formatUSD(saving)} ({savingPct}%) vs. traditional retail
          </p>
        ) : null}
      </div>
    </Link>
  );
}

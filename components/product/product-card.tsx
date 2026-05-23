import clsx from "clsx";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

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
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  className,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const price = product.priceRange.maxVariantPrice.amount;
  const comparable = product.meta?.comparableAt?.amount;
  const savings =
    comparable && Number(comparable) > Number(price)
      ? Math.round(
          ((Number(comparable) - Number(price)) / Number(comparable)) * 100,
        )
      : null;

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
        {savings ? (
          <span className="absolute left-3 top-3 bg-bone/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink backdrop-blur-sm">
            Save {savings}%
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
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
    </Link>
  );
}

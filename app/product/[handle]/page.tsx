import Footer from "components/layout/footer";
import { Reveal } from "components/motion/reveal";
import { BuyBox } from "components/product/buy-box";
import { ProductCarousel } from "components/product/product-carousel";
import { ProductCard } from "components/product/product-card";
import { ProductSpecs } from "components/product/product-specs";
import { Reviews } from "components/product/reviews";
import { SourcingStory } from "components/product/sourcing-story";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { getProduct, getProductRecommendations } from "lib/shopify";
import type { Image } from "lib/shopify/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: { index: indexable, follow: indexable },
    },
    openGraph: url ? { images: [{ url, width, height, alt }] } : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    aggregateRating: product.meta?.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.meta.rating,
          reviewCount: product.meta.reviewCount,
        }
      : undefined,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  const category = product.meta?.category;
  const categoryHandle = category?.toLowerCase();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mx-auto max-w-[1400px] px-4 pt-8 lg:px-8">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-clay">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          {category ? (
            <>
              <li>
                <Link
                  href={`/search/${categoryHandle}`}
                  className="hover:text-ink"
                >
                  {category}
                </Link>
              </li>
              <li aria-hidden>/</li>
            </>
          ) : null}
          <li className="text-ink">{product.title}</li>
        </ol>
      </nav>

      {/* Gallery + buy box */}
      <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <ProductCarousel
            images={product.images.map((image: Image) => ({
              src: image.url,
              altText: image.altText,
            }))}
          />

          <Suspense fallback={null}>
            <BuyBox product={product} />
          </Suspense>
        </div>
      </div>

      <SourcingStory product={product} />
      <ProductSpecs product={product} />
      <Reviews product={product} />

      <RelatedProducts id={product.id} />

      <Footer />
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 lg:px-8 lg:py-28">
      <Reveal className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-clay">
          You may also consider
        </p>
        <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">
          Pairs beautifully with
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.handle} product={product} />
        ))}
      </div>
    </section>
  );
}

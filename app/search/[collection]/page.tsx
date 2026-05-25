import { getCollection, getCollectionProducts } from "lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductGridItems from "components/layout/product-grid-items";
import { CollectionPills } from "components/layout/search/collection-pills";
import { SortDropdown } from "components/layout/search/sort-dropdown";
import { defaultSort, sorting } from "lib/constants";
import { collectionHero } from "lib/data/catalog";
import Image from "next/image";

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} products`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const collection = await getCollection(params.collection);
  const products = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });

  const heroImage = collectionHero[params.collection];

  return (
    <section>
      {/* Collection hero */}
      <div className="relative flex h-[180px] w-full items-center justify-center overflow-hidden bg-espresso md:h-[230px]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={collection?.title ?? params.collection}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-serif text-3xl text-bone md:text-5xl">
            {collection?.title ?? params.collection}
          </h1>
          {collection?.description ? (
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-bone/85 md:mt-3 md:text-base">
              {collection.description}
            </p>
          ) : null}
        </div>
      </div>

      {/* Controls */}
      <div className="mx-auto max-w-[1400px] px-4 pt-10 lg:px-8">
        <CollectionPills active={params.collection} />
        <div className="mt-6 flex items-center justify-between border-b border-sand pb-4">
          <p className="text-xs uppercase tracking-[0.15em] text-clay">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
          <SortDropdown />
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8">
        {products.length === 0 ? (
          <p className="py-16 text-center text-walnut">
            No pieces found in this collection yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:gap-x-10">
            <ProductGridItems products={products} />
          </ul>
        )}
      </div>
    </section>
  );
}

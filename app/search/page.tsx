import ProductGridItems from "components/layout/product-grid-items";
import { CollectionPills } from "components/layout/search/collection-pills";
import { SortDropdown } from "components/layout/search/sort-dropdown";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Search",
  description: "Search the Maison Noyer collection.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length === 1 ? "result" : "results";

  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-4 pt-12 lg:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-clay">
          {searchValue ? "Search" : "The Collection"}
        </p>
        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">
          {searchValue ? `“${searchValue}”` : "Every piece, one place"}
        </h1>

        <div className="mt-8">
          <CollectionPills active="" />
        </div>
        <div className="mt-6 flex items-center justify-between border-b border-sand pb-4">
          <p className="text-xs uppercase tracking-[0.15em] text-clay">
            {searchValue
              ? `${products.length} ${resultsText}`
              : `${products.length} pieces`}
          </p>
          <SortDropdown />
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8">
        {products.length === 0 ? (
          <p className="py-16 text-center text-walnut">
            {searchValue
              ? `No pieces match “${searchValue}”. Try another search.`
              : "No pieces available."}
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

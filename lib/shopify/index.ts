import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "lib/constants";
import {
  NAV_MENU,
  FOOTER_MENU,
  getLocalCollection,
  getLocalCollectionProducts,
  getLocalCollections,
  getLocalProduct,
  getLocalProducts,
  getLocalRecommendations,
} from "lib/data/catalog";
import { isShopifyError } from "lib/type-guards";
import { ensureStartsWith } from "lib/utils";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
  revalidateTag,
} from "next/cache";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart";
import { getCartQuery } from "./queries/cart";
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
} from "./queries/collection";
import { getMenuQuery } from "./queries/menu";
import { getPageQuery, getPagesQuery } from "./queries/page";
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
} from "./queries/product";
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Product,
  ProductMeta,
  ProductReview,
  ShopifyMetafield,
  Spec,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
} from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = domain ? `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}` : "";
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function shopifyFetch<T>({
  headers,
  query,
  variables,
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    if (!endpoint) {
      throw new Error("SHOPIFY_STORE_DOMAIN environment variable is not set");
    }

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || "unknown",
        status: e.status || 500,
        message: e.message,
        query,
      };
    }

    throw {
      error: e,
      query,
    };
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

// Used only in local/demo mode (no Shopify configured) so cart mutations don't
// throw. In production (env vars set) the real Shopify cart is used throughout.
const localDemoCart = (): Cart => ({
  id: "demo-cart",
  checkoutUrl: "",
  totalQuantity: 0,
  lines: [],
  cost: {
    subtotalAmount: { amount: "0.0", currencyCode: "USD" },
    totalAmount: { amount: "0.0", currencyCode: "USD" },
    totalTaxAmount: { amount: "0.0", currencyCode: "USD" },
  },
});

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
};

const reshapeCollection = (
  collection: ShopifyCollection,
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

const metafieldText = (mf: ShopifyMetafield | undefined): string | undefined =>
  mf?.value?.trim() ? mf.value : undefined;

const metafieldNumber = (
  mf: ShopifyMetafield | undefined,
): number | undefined => {
  const v = metafieldText(mf);
  if (v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const metafieldJSON = <T>(mf: ShopifyMetafield | undefined): T | undefined => {
  const v = metafieldText(mf);
  if (v === undefined) return undefined;
  try {
    return JSON.parse(v) as T;
  } catch {
    return undefined;
  }
};

const metafieldMoney = (mf: ShopifyMetafield | undefined) => {
  const v = metafieldText(mf);
  if (v === undefined) return undefined;
  // Shopify `money` metafields serialize as {"amount":"9800.0","currency_code":"USD"}
  try {
    const parsed = JSON.parse(v) as {
      amount?: string | number;
      currency_code?: string;
      currencyCode?: string;
    };
    if (parsed?.amount !== undefined) {
      return {
        amount: String(parsed.amount),
        currencyCode: parsed.currency_code || parsed.currencyCode || "USD",
      };
    }
  } catch {
    // Fall through: treat as a bare number string.
  }
  const n = Number(v);
  return Number.isFinite(n)
    ? { amount: String(n), currencyCode: "USD" }
    : undefined;
};

// Builds the furniture-specific `meta` block from Shopify "custom" metafields.
const reshapeProductMetafields = (
  product: ShopifyProduct,
): ProductMeta | undefined => {
  const reviews = metafieldJSON<ProductReview[]>(product.metaReviews);

  // Judge.me (namespace "reviews") is the source of truth for ratings once the
  // app is connected. `reviews.rating` serializes as
  // {"value":"4.9","scale_min":"1.0","scale_max":"5.0"}.
  const judgeMe = metafieldJSON<{ value?: string }>(product.metaReviewsRating);
  const judgeMeRating = judgeMe?.value ? Number(judgeMe.value) : undefined;
  const judgeMeCount = metafieldNumber(product.metaReviewsCount);

  let rating =
    judgeMeRating !== undefined && Number.isFinite(judgeMeRating)
      ? judgeMeRating
      : metafieldNumber(product.metaRating);
  let reviewCount = judgeMeCount ?? metafieldNumber(product.metaReviewCount);

  // Last resort: derive from a seeded reviews list.
  if (reviews?.length) {
    if (rating === undefined) {
      rating = Number(
        (
          reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
        ).toFixed(1),
      );
    }
    if (reviewCount === undefined) reviewCount = reviews.length;
  }

  const meta: ProductMeta = {
    tagline: metafieldText(product.metaTagline),
    comparableAt: metafieldMoney(product.metaComparableAt),
    comparableTo: metafieldText(product.metaComparableTo),
    category: metafieldText(product.metaCategory),
    sourcingStory: metafieldText(product.metaSourcingStory),
    designStory: metafieldText(product.metaDesignStory),
    care: metafieldText(product.metaCare),
    leadTime: metafieldText(product.metaLeadTime),
    features: metafieldJSON<string[]>(product.metaFeatures),
    craftNotes: metafieldJSON<string[]>(product.metaCraftNotes),
    materials: metafieldJSON<Spec[]>(product.metaMaterials),
    dimensions: metafieldJSON<Spec[]>(product.metaDimensions),
    faqs: metafieldJSON<{ question: string; answer: string }[]>(
      product.metaFaqs,
    ),
    reviews,
    rating,
    reviewCount,
  };

  // If no metafields were set, return undefined so the PDP renders cleanly.
  const hasContent = Object.values(meta).some(
    (v) => v !== undefined && !(Array.isArray(v) && v.length === 0),
  );
  return hasContent ? meta : undefined;
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const {
    images,
    variants,
    metaTagline,
    metaComparableAt,
    metaComparableTo,
    metaCategory,
    metaSourcingStory,
    metaDesignStory,
    metaCraftNotes,
    metaFeatures,
    metaMaterials,
    metaDimensions,
    metaCare,
    metaLeadTime,
    metaRating,
    metaReviewCount,
    metaReviews,
    metaFaqs,
    metaReviewsRating,
    metaReviewsCount,
    ...rest
  } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
    meta: reshapeProductMetafields(product),
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  if (!endpoint) return localDemoCart();

  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  if (!endpoint) return localDemoCart();

  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  if (!endpoint) return localDemoCart();

  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  if (!endpoint) return localDemoCart();

  const cartId = (await cookies()).get("cartId")?.value!;
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(): Promise<Cart | undefined> {
  "use cache: private";
  cacheTag(TAGS.cart);
  cacheLife("seconds");

  if (!endpoint) {
    return undefined;
  }

  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    return undefined;
  }

  try {
    const res = await shopifyFetch<ShopifyCartOperation>({
      query: getCartQuery,
      variables: { cartId },
    });

    // Old carts becomes `null` when you checkout.
    if (!res.body.data.cart) {
      return undefined;
    }

    return reshapeCart(res.body.data.cart);
  } catch (e) {
    console.error(`[shopify] getCart failed; returning empty cart.`, e);
    return undefined;
  }
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  if (!endpoint) {
    return getLocalCollection(handle);
  }

  try {
    const res = await shopifyFetch<ShopifyCollectionOperation>({
      query: getCollectionQuery,
      variables: {
        handle,
      },
    });

    return reshapeCollection(res.body.data.collection);
  } catch (e) {
    console.error(
      `[shopify] getCollection("${handle}") failed; falling back to local.`,
      e,
    );
    return getLocalCollection(handle);
  }
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    return getLocalCollectionProducts({ collection, sortKey, reverse });
  }

  try {
    const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
      query: getCollectionProductsQuery,
      variables: {
        handle: collection,
        reverse,
        sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
      },
    });

    if (!res.body.data.collection) {
      console.log(`No collection found for \`${collection}\``);
      return [];
    }

    return reshapeProducts(
      removeEdgesAndNodes(res.body.data.collection.products),
    );
  } catch (e) {
    console.error(
      `[shopify] getCollectionProducts("${collection}") failed; returning none.`,
      e,
    );
    return [];
  }
}

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  if (!endpoint) {
    return [
      {
        handle: "",
        title: "All",
        description: "All products",
        seo: {
          title: "All",
          description: "All products",
        },
        path: "/search",
        updatedAt: new Date().toISOString(),
      },
      ...getLocalCollections(),
    ];
  }

  const allEntry = {
    handle: "",
    title: "All",
    description: "All products",
    seo: { title: "All", description: "All products" },
    path: "/search",
    updatedAt: new Date().toISOString(),
  };

  try {
    const res = await shopifyFetch<ShopifyCollectionsOperation>({
      query: getCollectionsQuery,
    });
    const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
    return [
      allEntry,
      // Filter out the `hidden` collections.
      // Collections that start with `hidden-*` need to be hidden on the search page.
      ...reshapeCollections(shopifyCollections).filter(
        (collection) => !collection.handle.startsWith("hidden"),
      ),
    ];
  } catch (e) {
    console.error(`[shopify] getCollections failed; falling back to local.`, e);
    return [allEntry, ...getLocalCollections()];
  }
}

export async function getMenu(handle: string): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const fallback = handle.includes("footer") ? FOOTER_MENU : NAV_MENU;
  if (!endpoint) {
    return fallback;
  }

  try {
    const res = await shopifyFetch<ShopifyMenuOperation>({
      query: getMenuQuery,
      variables: {
        handle,
      },
    });

    return (
      res.body?.data?.menu?.items.map(
        (item: { title: string; url: string }) => ({
          title: item.title,
          path: item.url
            .replace(domain, "")
            .replace("/collections", "/search")
            .replace("/pages", ""),
        }),
      ) || []
    );
  } catch (e) {
    console.error(`[shopify] getMenu("${handle}") failed; using fallback.`, e);
    return fallback;
  }
}

export async function getPage(handle: string): Promise<Page | undefined> {
  if (!endpoint) {
    return undefined;
  }

  try {
    const res = await shopifyFetch<ShopifyPageOperation>({
      query: getPageQuery,
      variables: { handle },
    });

    return res.body.data.pageByHandle;
  } catch (e) {
    console.error(`[shopify] getPage("${handle}") failed.`, e);
    return undefined;
  }
}

export async function getPages(): Promise<Page[]> {
  if (!endpoint) {
    return [];
  }

  try {
    const res = await shopifyFetch<ShopifyPagesOperation>({
      query: getPagesQuery,
    });

    return removeEdgesAndNodes(res.body.data.pages);
  } catch (e) {
    console.error(`[shopify] getPages failed.`, e);
    return [];
  }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    return getLocalProduct(handle);
  }

  try {
    const res = await shopifyFetch<ShopifyProductOperation>({
      query: getProductQuery,
      variables: {
        handle,
      },
    });

    return reshapeProduct(res.body.data.product, false);
  } catch (e) {
    console.error(
      `[shopify] getProduct("${handle}") failed; falling back to local catalog.`,
      e,
    );
    return getLocalProduct(handle);
  }
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  // productId is our gid form when local: gid://maison-noyer/Product/<handle>
  const localHandle = productId.split("/").pop() ?? "";

  if (!endpoint) {
    return getLocalRecommendations(localHandle);
  }

  try {
    const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
      query: getProductRecommendationsQuery,
      variables: {
        productId,
      },
    });

    return reshapeProducts(res.body.data.productRecommendations);
  } catch (e) {
    console.error(
      `[shopify] getProductRecommendations failed; returning none.`,
      e,
    );
    return [];
  }
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!endpoint) {
    return getLocalProducts({ query, sortKey, reverse });
  }

  try {
    const res = await shopifyFetch<ShopifyProductsOperation>({
      query: getProductsQuery,
      variables: {
        query,
        reverse,
        sortKey,
      },
    });

    return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
  } catch (e) {
    console.error(`[shopify] getProducts failed; returning none.`, e);
    return [];
  }
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];
  const topic = (await headers()).get("x-shopify-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.");
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections, "seconds");
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products, "seconds");
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

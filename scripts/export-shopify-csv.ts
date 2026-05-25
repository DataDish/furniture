/**
 * Generates a Shopify product-import CSV from the local Maison Noyer catalog,
 * matching the standard Shopify "Product Template" columns and appending all of
 * our PDP metafields under section-based namespaces: details.* sourcing.* specs.*
 *
 * Metafield value formatting follows Shopify's CSV rules:
 *   - list.* types  -> semicolon-separated ("a; b; c")
 *   - json type     -> raw JSON string
 *   - everything else (text / number) -> plain value
 * Headers use the technical-only form `product.metafields.<ns>.<key>` so the
 * importer matches them regardless of the definition's display name.
 *
 * NOTE: a metafield DEFINITION (matching namespace + key + type) must exist in
 * Shopify (Settings > Custom data > Products) before import, or Shopify ignores
 * the column.
 *
 * Run: pnpm exec tsx scripts/export-shopify-csv.ts [outputPath]
 */
import { writeFileSync } from "node:fs";
import { getLocalProducts } from "../lib/data/catalog";
import type { Product, ProductMeta } from "../lib/shopify/types";

const TEMPLATE_COLUMNS = [
  "Title",
  "URL handle",
  "Description",
  "Vendor",
  "Product category",
  "Type",
  "Tags",
  "Published on online store",
  "Status",
  "SKU",
  "Barcode",
  "Option1 name",
  "Option1 value",
  "Option1 Linked To",
  "Option2 name",
  "Option2 value",
  "Option2 Linked To",
  "Option3 name",
  "Option3 value",
  "Option3 Linked To",
  "Price",
  "Compare-at price",
  "Cost per item",
  "Charge tax",
  "Tax code",
  "Unit price total measure",
  "Unit price total measure unit",
  "Unit price base measure",
  "Unit price base measure unit",
  "Inventory tracker",
  "Inventory quantity",
  "Continue selling when out of stock",
  "Weight value (grams)",
  "Weight unit for display",
  "Requires shipping",
  "Fulfillment service",
  "Product image URL",
  "Image position",
  "Image alt text",
  "Variant image URL",
  "Gift card",
  "SEO title",
  "SEO description",
  "Color (product.metafields.shopify.color-pattern)",
  "Google Shopping / Google product category",
  "Google Shopping / Gender",
  "Google Shopping / Age group",
  "Google Shopping / Manufacturer part number (MPN)",
  "Google Shopping / Ad group name",
  "Google Shopping / Ads labels",
  "Google Shopping / Condition",
  "Google Shopping / Custom product",
  "Google Shopping / Custom label 0",
  "Google Shopping / Custom label 1",
  "Google Shopping / Custom label 2",
  "Google Shopping / Custom label 3",
  "Google Shopping / Custom label 4",
] as const;

const list = (arr?: string[]) => (arr?.length ? arr.join("; ") : "");
const json = (v?: unknown[]) => (v?.length ? JSON.stringify(v) : "");
const num = (n?: number) => (n !== undefined ? String(n) : "");
const money = (m?: { amount: string }) =>
  m?.amount ? Number(m.amount).toFixed(2) : "";

// Each metafield: technical header + how to read its value from `meta`.
const METAFIELDS: {
  header: string;
  get: (m: ProductMeta | undefined) => string;
}[] = [
  // details.* (general product detail content)
  { header: "product.metafields.details.tagline", get: (m) => m?.tagline ?? "" },
  { header: "product.metafields.details.category", get: (m) => m?.category ?? "" },
  {
    header: "product.metafields.details.design_story",
    get: (m) => m?.designStory ?? "",
  },
  {
    header: "product.metafields.details.craft_notes",
    get: (m) => list(m?.craftNotes),
  },
  {
    header: "product.metafields.details.features",
    get: (m) => list(m?.features),
  },
  { header: "product.metafields.details.care", get: (m) => m?.care ?? "" },
  {
    header: "product.metafields.details.lead_time",
    get: (m) => m?.leadTime ?? "",
  },
  { header: "product.metafields.details.rating", get: (m) => num(m?.rating) },
  {
    header: "product.metafields.details.review_count",
    get: (m) => num(m?.reviewCount),
  },
  {
    header: "product.metafields.details.reviews",
    get: (m) => json(m?.reviews),
  },
  // sourcing.* (the value / "why is it less" story)
  {
    header: "product.metafields.sourcing.comparable_at_price",
    get: (m) => money(m?.comparableAt),
  },
  {
    header: "product.metafields.sourcing.comparable_to",
    get: (m) => m?.comparableTo ?? "",
  },
  {
    header: "product.metafields.sourcing.story",
    get: (m) => m?.sourcingStory ?? "",
  },
  // specs.* (the accordions)
  {
    header: "product.metafields.specs.materials",
    get: (m) => json(m?.materials),
  },
  {
    header: "product.metafields.specs.dimensions",
    get: (m) => json(m?.dimensions),
  },
];

const HEADER = [...TEMPLATE_COLUMNS, ...METAFIELDS.map((m) => m.header)];

function csvEscape(value: string): string {
  if (value === "") return "";
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function rowToLine(row: Record<string, string>): string {
  return HEADER.map((col) => csvEscape(row[col] ?? "")).join(",");
}

function optionValue(
  variant: Product["variants"][number],
  optionName: string,
): string {
  return variant.selectedOptions.find((o) => o.name === optionName)?.value ?? "";
}

const products = getLocalProducts({});
const lines: string[] = [HEADER.join(",")];

for (const product of products) {
  const meta = product.meta;
  const options = product.options;
  const price = Number(product.priceRange.maxVariantPrice.amount).toFixed(2);
  const compareAt = meta?.comparableAt?.amount
    ? Number(meta.comparableAt.amount).toFixed(2)
    : "";

  product.variants.forEach((variant, vIndex) => {
    const isFirst = vIndex === 0;
    const row: Record<string, string> = {};

    row["URL handle"] = product.handle;

    // Variant-level fields (every row)
    row["Option1 name"] = options[0]?.name ?? "Title";
    row["Option1 value"] = options[0]
      ? optionValue(variant, options[0].name)
      : "Default Title";
    if (options[1]) {
      row["Option2 name"] = options[1].name;
      row["Option2 value"] = optionValue(variant, options[1].name);
    }
    row["SKU"] = `MN-${product.handle.toUpperCase()}-${vIndex + 1}`;
    row["Price"] = price;
    row["Compare-at price"] = compareAt;
    row["Charge tax"] = "TRUE";
    row["Inventory tracker"] = "shopify";
    row["Inventory quantity"] = "25";
    row["Continue selling when out of stock"] = "DENY";
    row["Weight unit for display"] = "kg";
    row["Requires shipping"] = "TRUE";
    row["Fulfillment service"] = "manual";
    row["Gift card"] = "FALSE";

    if (isFirst) {
      row["Title"] = product.title;
      row["Description"] = product.descriptionHtml || product.description;
      row["Vendor"] = "Maison Noyer";
      row["Type"] = meta?.category ?? "";
      row["Tags"] = product.tags.join(", ");
      row["Published on online store"] = "TRUE";
      row["Status"] = "active";
      row["SEO title"] = product.seo?.title ?? "";
      row["SEO description"] = product.seo?.description ?? "";
      row["Product image URL"] = product.images[0]?.url ?? "";
      row["Image position"] = "1";
      row["Image alt text"] = product.images[0]?.altText ?? product.title;

      for (const mf of METAFIELDS) {
        row[mf.header] = mf.get(meta);
      }
    }

    lines.push(rowToLine(row));
  });

  // Extra product images as their own rows.
  product.images.slice(1).forEach((image, i) => {
    const row: Record<string, string> = {};
    row["URL handle"] = product.handle;
    row["Product image URL"] = image.url;
    row["Image position"] = String(i + 2);
    row["Image alt text"] = image.altText ?? product.title;
    lines.push(rowToLine(row));
  });
}

const out = process.argv[2] ?? "maison-noyer-shopify-products.csv";
writeFileSync(out, lines.join("\n") + "\n", "utf8");
console.log(
  `Wrote ${products.length} products (${lines.length - 1} rows) to ${out}`,
);

import {
  ChatBubbleLeftRightIcon,
  HomeModernIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { AddToCart } from "components/cart/add-to-cart";
import { Product } from "lib/shopify/types";
import Link from "next/link";
import { Accordion, type AccordionItem } from "./accordion";
import { ShopPayInstallments } from "./shop-pay-installments";
import { Stars } from "./stars";
import { VariantSelector } from "./variant-selector";

const usd0 = (n: string | number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));

function SpecList({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="divide-y divide-sand">
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-6 py-2.5">
          <dt className="text-clay">{r.label}</dt>
          <dd className="text-right text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-1 w-1 flex-none rounded-full bg-brass" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function BuyBox({ product }: { product: Product }) {
  const meta = product.meta;
  const price = product.priceRange.maxVariantPrice.amount;
  const comparable = meta?.comparableAt?.amount;
  const saving =
    comparable && Number(comparable) > Number(price)
      ? Number(comparable) - Number(price)
      : null;
  const savingPct =
    comparable && saving
      ? Math.round((saving / Number(comparable)) * 100)
      : null;

  // Build accordion sections from whatever metadata exists.
  const detailItems: string[] = [
    ...(meta?.craftNotes ?? []),
    ...(meta?.features ?? []),
  ];

  const accordion: AccordionItem[] = [];
  if (detailItems.length) {
    accordion.push({
      title: "Details",
      content: <BulletList items={detailItems} />,
    });
  }
  if (meta?.materials?.length) {
    accordion.push({
      title: "Materials",
      content: <SpecList rows={meta.materials} />,
    });
  }
  // Dimensions, care, and delivery/returns now live in the tabbed section
  // below the fold (ProductTabs).

  return (
    <div>
      {meta?.category ? (
        <p className="text-xs uppercase tracking-[0.25em] text-clay">
          {meta.category}
        </p>
      ) : null}

      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">
        {product.title}
      </h1>

      {meta?.tagline ? (
        <p className="mt-3 text-base italic text-walnut">{meta.tagline}</p>
      ) : null}

      {meta?.rating ? (
        <a
          href="#reviews"
          className="mt-4 inline-flex items-center gap-2 text-sm text-walnut"
        >
          <Stars rating={meta.rating} />
          <span className="border-b border-transparent hover:border-walnut">
            {meta.rating} · {meta.reviewCount} reviews
          </span>
        </a>
      ) : null}

      <div className="mt-6 flex flex-wrap items-end gap-4 border-y border-sand py-5">
        <span className="font-serif text-3xl text-ink">{usd0(price)}</span>
        {comparable ? (
          <span className="flex flex-col leading-tight">
            <span className="text-lg text-stone line-through">
              {usd0(comparable)}
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-clay">
              Traditional retail
            </span>
          </span>
        ) : null}
        {savingPct ? (
          <span className="bg-sage/15 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.12em] text-sage">
            Save {usd0(saving!)} ({savingPct}%) vs. traditional retail
          </span>
        ) : null}
      </div>

      {/* Description */}
      {product.description ? (
        <p className="mt-6 text-sm leading-relaxed text-walnut">
          {product.description}
        </p>
      ) : null}

      <div className="mt-7">
        <VariantSelector
          options={product.options}
          variants={product.variants}
        />
      </div>

      <div className="mt-2">
        <AddToCart product={product} />
      </div>

      <ShopPayInstallments product={product} />

      {meta?.leadTime ? (
        <p className="mt-4 text-center text-xs uppercase tracking-[0.15em] text-clay">
          {meta.leadTime}
        </p>
      ) : null}

      {/* Our Promises */}
      <div className="mt-7 border-t border-sand pt-7">
        <p className="mb-4 text-center text-xs uppercase tracking-[0.25em] text-clay">
          Our Promises
        </p>
        <ul className="grid grid-cols-3 gap-3 text-center">
          {[
            [TruckIcon, "Free white-glove delivery"],
            [HomeModernIcon, "100-night home trial"],
            [ShieldCheckIcon, "Lifetime frame warranty"],
          ].map(([Icon, label], i) => {
            const I = Icon as typeof TruckIcon;
            return (
              <li key={i} className="flex flex-col items-center gap-2">
                <I className="h-6 w-6 text-clay" strokeWidth={1} />
                <span className="text-[11px] leading-tight text-walnut">
                  {label as string}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Concierge / design specialist */}
      <div className="mt-6 flex items-start gap-4 border border-sand bg-cream p-5">
        <ChatBubbleLeftRightIcon
          className="h-7 w-7 flex-none text-brass"
          strokeWidth={1}
        />
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-clay">
            Concierge service
          </p>
          <p className="mt-1 font-serif text-lg text-ink">
            Talk to a design specialist
          </p>
          <p className="mt-1 text-sm leading-relaxed text-walnut">
            Unsure about finishes, sizing, or how this piece works in your room?
            Speak one-on-one with a specialist who knows the collection.
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-block border-b border-ink pb-0.5 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:text-clay"
          >
            Book a design consult
          </Link>
        </div>
      </div>

      {/* Expandable detail sections */}
      {accordion.length ? (
        <div className="mt-8">
          <Accordion items={accordion} />
        </div>
      ) : null}
    </div>
  );
}

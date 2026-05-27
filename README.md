# Maison Noyer — Site Guide

How this storefront is wired and how to change things. This is the reference for
editors and developers: where content lives, every Shopify metafield we use, the
environment variables, and the integrations.

---

## 1. How data flows

- The site is a **Next.js (App Router) headless storefront** for **Shopify**.
- When the Shopify env vars are set, **products, collections, menus, cart, and
  checkout all pull live from Shopify**. When they are not set (e.g. local dev),
  the site falls back to a built-in demo catalog in `lib/data/catalog.ts` so it
  still runs. All Shopify fetches fail-soft (a Shopify error logs and falls back
  rather than crashing the page/build).
- Storefront API version: **`2025-01`** (set in `lib/constants.ts`).
- Customer accounts and checkout are **hosted by Shopify** (see §6).

---

## 2. Environment variables

Set these in Vercel (Project → Settings → Environment Variables), then redeploy.
See `.env.example` for the full list.

| Variable | Required | What it does |
|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | yes | `your-store.myshopify.com`. When set, the site uses live Shopify data. |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | yes | **Storefront API** public token (from the Headless channel). Not the Admin token. |
| `SHOPIFY_REVALIDATION_SECRET` | rec. | Shared secret for the `/api/revalidate` webhook so product/collection edits refresh without a redeploy. |
| `SITE_NAME` / `COMPANY_NAME` | rec. | `Maison Noyer`. |
| `SHOPIFY_ACCOUNT_URL` | optional | Override the `/account` redirect target if you use a custom customer-account domain. Defaults to `https://<store>/account`. |
| `NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN` | optional | Enables the Judge.me review widget on PDPs. |
| `NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN` | optional | Judge.me public token (Judge.me → Settings → API). |
| `KLAVIYO_PRIVATE_API_KEY` | optional | Private key (`pk_…`). Sends email-capture + contact-form leads to Klaviyo. |
| `KLAVIYO_LIST_ID` | optional | The Klaviyo list new subscribers join. |

Shop Pay Installments needs no env var — just enable it in **Shopify admin →
Settings → Payments** and the PDP banner appears for real products.

---

## 3. Product metafields (the PDP "CMS")

All the rich product-detail content on PDPs comes from Shopify **metafields**.
Create each one in **Shopify admin → Settings → Custom data → Products → Add
definition** using the exact namespace, key, and type below. **Definitions must
exist before importing or the importer/Storefront API ignores them.** Creating a
definition also grants Storefront API read access automatically.

### Namespace `details`

| Key | Type | Shows up as |
|---|---|---|
| `tagline` | Single line text | Italic line under the product title |
| `category` | Single line text | Eyebrow + breadcrumb (e.g. "Living") |
| `design_story` | Multi-line text | "The design" editorial section |
| `craft_notes` | List of single line text | "Details" accordion (bulleted) |
| `features` | List of single line text | "Details" accordion (bulleted) |
| `care` | Multi-line text | "Care & Maintenance" accordion |
| `lead_time` | Single line text | Lead-time line + "Shipping & Returns" accordion |
| `rating` | Decimal | Star rating (fallback if Judge.me isn't connected) |
| `review_count` | Integer | Review count (fallback) |
| `reviews` | JSON | Built-in reviews list (fallback when Judge.me is off) |
| `faqs` | JSON | Overrides the default PDP FAQ list for this product |
| `comparison` | JSON | Overrides the "vs. the alternatives" comparison table |
| `tear_sheet` | URL | Link to a downloadable spec/tear-sheet PDF (shown in the product tabs) |

### Namespace `sourcing`

| Key | Type | Shows up as |
|---|---|---|
| `comparable_at_price` | Decimal | "Traditional retail" strikethrough + savings badge |
| `comparable_to` | Single line text | "The same piece as …" line in the sourcing story |
| `story` | Multi-line text | The "Why is it less?" narrative section |

### Namespace `specs`

| Key | Type | Shows up as |
|---|---|---|
| `materials` | JSON | "Materials" accordion |
| `dimensions` | JSON | "Dimensions & Sizing" accordion |

### Namespace `reviews` (managed by Judge.me)

| Key | Type | Notes |
|---|---|---|
| `rating` | Rating | Written by Judge.me's Shopify sync. Takes priority over `details.rating`. |
| `rating_count` | Integer | Written by Judge.me's Shopify sync. |

Do **not** create the `reviews.*` definitions yourself — Judge.me owns them.

### JSON value formats

```jsonc
// specs.materials  (and specs.dimensions — same shape)
[
  { "label": "Frame", "value": "Kiln-dried European beech" },
  { "label": "Upholstery", "value": "Belgian bouclé" }
]

// details.reviews
[
  {
    "author": "Eleanor V.",
    "location": "Greenwich, CT",
    "rating": 5,
    "date": "2026-01-04",
    "title": "Indistinguishable from the original",
    "body": "We sat on the gallery version the same week…",
    "verified": true
  }
]

// details.faqs
[
  { "question": "How does delivery work?", "answer": "Every order includes…" }
]
```

> CSV import note: **List** metafields (`craft_notes`, `features`) use
> semicolon-separated values in the CSV (`Item one; Item two`). **JSON**
> metafields use the raw JSON above. The Storefront API returns list types as a
> JSON array — the code handles both.

### Seeding products from the demo catalog

`scripts/export-shopify-csv.ts` turns the local catalog into a Shopify product
import CSV (template columns + all the metafield columns above):

```bash
pnpm exec tsx scripts/export-shopify-csv.ts maison-noyer-products.csv
```

Create the metafield **definitions** first, then **Products → Import** the CSV.

---

## 4. Collections

Importing products with tags does **not** create collections. Create these as
**automated (smart) collections** — condition **"Product tag is equal to
`<handle>`"** (products are already tagged to match):

`living`, `dining`, `bedroom`, `lighting`, `sofas`, `chairs`, `tables`,
`storage`, `beds`, `new`

⚠️ The collection **handle** must match exactly. "New Arrivals" auto-generates
`new-arrivals` — change its handle to **`new`** or those links 404.

---

## 5. What's editable in Shopify vs. in code

**From Shopify (no deploy needed):** product titles, prices, images, variants,
descriptions, the metafields in §3, collections, and the customer/checkout flow.

**In code (edit the file, then redeploy):**

| Content | File |
|---|---|
| Homepage sections & copy | `app/page.tsx` |
| Hero image + headline | `app/page.tsx` (hero image id) and `components/home/hero.tsx` |
| "Where your money goes" percentages | `components/price-transparency.tsx` (`BREAKDOWN`) |
| Mega menu (columns + featured) | `lib/data/catalog.ts` (`MEGA_MENU`) |
| Footer links & columns | `components/layout/footer.tsx` |
| Announcement bar messages | `components/layout/navbar/navbar-client.tsx` (`ANNOUNCEMENTS`) |
| 15%-off popup + promo code | `components/promo-popup.tsx` (`PROMO_CODE`) |
| Default PDP FAQs | `components/product/product-faq.tsx` (`DEFAULT_FAQS`) |
| Policy / info page copy | `app/{trial,delivery,warranty,materials,trade,custom,contact,privacy,terms,accessibility}/page.tsx` |
| Local demo catalog (no Shopify) | `lib/data/catalog.ts` |
| Brand colors & fonts | `app/globals.css` (`@theme`) |

---

## 6. Integrations

**Reviews — Judge.me.** Set the two `NEXT_PUBLIC_JUDGEME_*` env vars. Enable
Judge.me's "Shopify product rating metafield" sync so `reviews.rating` /
`reviews.rating_count` populate (this drives the stars on listing/product pages).
The full review widget renders on the PDP; without Judge.me it falls back to the
built-in reviews from the `details.reviews` metafield. Code:
`components/product/judgeme-reviews.tsx`.

**Email capture — Klaviyo.** The 15%-off popup and footer newsletter, plus the
contact / custom-sourcing / trade forms, send leads to Klaviyo via the
`subscribeEmail` server action (`lib/klaviyo.ts`). Set `KLAVIYO_PRIVATE_API_KEY`
and `KLAVIYO_LIST_ID`. The contact forms currently capture the lead and log
server-side — wire `lib/contact.ts` to email/CRM if you want delivery to an inbox.

**Shop Pay Installments.** The PDP shows Shopify's official
`<shopify-payment-terms>` banner below Add to Cart
(`components/product/shop-pay-installments.tsx`). Enable Shop Pay Installments in
Shopify Payments; it appears for eligible products/amounts.

**Customer accounts.** Hosted by Shopify. The header "account" icon and the
`/account` route redirect to Shopify's secure account/login pages. Enable
customer accounts in Shopify admin → Settings → Customer accounts.

---

## 7. Running locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm exec tsc --noEmit   # type-check
```

Without Shopify env vars the site runs on the local demo catalog. Note: with the
full Shopify cart, the cart only persists once Shopify is connected.

import type {
  Collection,
  Product,
  ProductMeta,
  ProductOption,
  ProductVariant,
} from "lib/shopify/types";

const CURRENCY = "USD";

/** Build a sized Unsplash URL from a verified photo id. */
export const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const money = (amount: number) => ({
  amount: amount.toFixed(2),
  currencyCode: CURRENCY,
});

const updatedAt = "2026-01-15T00:00:00Z";

type ProductInput = {
  handle: string;
  title: string;
  price: number;
  comparableAt: number;
  category: string;
  collections: string[];
  imageIds: string[];
  description: string;
  options?: ProductOption[];
  meta: Omit<
    ProductMeta,
    "comparableAt" | "category" | "rating" | "reviewCount"
  > & {
    rating?: number;
  };
  available?: boolean;
  createdRank: number;
};

function cartesian(
  options: ProductOption[],
): { name: string; value: string }[][] {
  if (!options.length) return [[]];
  return options.reduce<{ name: string; value: string }[][]>(
    (acc, option) => {
      const next: { name: string; value: string }[][] = [];
      for (const combo of acc) {
        for (const value of option.values) {
          next.push([...combo, { name: option.name, value }]);
        }
      }
      return next;
    },
    [[]],
  );
}

function buildVariants(
  handle: string,
  price: number,
  options: ProductOption[],
): ProductVariant[] {
  const combos = cartesian(options);
  return combos.map((selectedOptions, i) => ({
    id: `${handle}-v${i + 1}`,
    title: selectedOptions.map((o) => o.value).join(" / ") || "Default",
    availableForSale: true,
    selectedOptions,
    price: money(price),
  }));
}

function buildProduct(input: ProductInput): Product {
  const options = input.options ?? [];
  const variants = buildVariants(input.handle, input.price, options);
  const images = input.imageIds.map((id) => ({
    url: img(id),
    altText: input.title,
    width: 1600,
    height: 1067,
  }));

  const reviews = input.meta.reviews ?? [];
  const rating =
    input.meta.rating ??
    (reviews.length
      ? Number(
          (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(
            1,
          ),
        )
      : 4.9);

  return {
    id: `gid://maison-noyer/Product/${input.handle}`,
    handle: input.handle,
    availableForSale: input.available ?? true,
    title: input.title,
    description: input.description,
    descriptionHtml: `<p>${input.description}</p>`,
    options,
    priceRange: {
      maxVariantPrice: money(input.price),
      minVariantPrice: money(input.price),
    },
    variants,
    featuredImage: images[0]!,
    images,
    seo: {
      title: `${input.title} — Maison Noyer`,
      description: input.meta.tagline ?? input.description.slice(0, 150),
    },
    tags: input.collections,
    updatedAt,
    meta: {
      ...input.meta,
      category: input.category,
      comparableAt: money(input.comparableAt),
      rating,
      reviewCount: reviews.length,
    },
    // used internally for sorting by "newest"
    ...({ createdRank: input.createdRank } as object),
  } as Product & { createdRank: number };
}

const colorOption = (values: string[]): ProductOption => ({
  id: "color",
  name: "Color",
  values,
});
const materialOption = (values: string[]): ProductOption => ({
  id: "material",
  name: "Material",
  values,
});
const sizeOption = (values: string[]): ProductOption => ({
  id: "size",
  name: "Size",
  values,
});

const guarantee = [
  "100-night in-home trial",
  "Lifetime warranty on frames & joinery",
  "White-glove delivery & assembly included",
];

const PRODUCTS: Product[] = [
  buildProduct({
    handle: "lina-modular-sofa",
    title: "Lina Modular Sofa",
    price: 2450,
    comparableAt: 9800,
    category: "Living",
    collections: ["living", "sofas", "new"],
    createdRank: 14,
    imageIds: [
      "1555041469-a586c61ea9bc",
      "1493663284031-b7e3aefcae8e",
      "1586023492125-27b2c045efd7",
      "1616486338812-3dadae4b4ace",
    ],
    description:
      "A low, enveloping modular sofa with hand-tufted curves and a feather-down seat. Rearrange the modules to suit any room — the silhouette stays unmistakably architectural.",
    options: [
      colorOption(["Bouclé Ivory", "Camel Linen", "Espresso Velvet"]),
      sizeOption(["3-Seat", "Sectional"]),
    ],
    meta: {
      tagline: "The sculptural Italian modular, made honest.",
      comparableTo:
        "the tufted Italian gallery modular that defined 1970s lounging",
      sourcingStory:
        "The piece that inspired the Lina sells for nearly $10,000 because of the gallery name stitched into the cushion — not the cushion itself. We commissioned ours from the same family-run upholstery atelier in Lombardy that supplies several of those galleries, using the identical CFC-free foam, feather-down wrap, and kiln-dried beech frame.",
      designStory:
        "Designed around a single radius: every curve on the Lina shares the same 38cm arc, which is what gives the sofa its calm, continuous read from any angle.",
      craftNotes: [
        "Kiln-dried beech hardwood frame, double-doweled and corner-blocked",
        "Hand-wrapped feather-down over high-resilience CFC-free foam",
        "Hand-tufted by a single upholsterer per sofa — signed inside the base",
      ],
      materials: [
        { label: "Frame", value: "Kiln-dried European beech" },
        { label: "Fill", value: "Feather-down wrapped HR foam" },
        {
          label: "Upholstery",
          value: "Belgian bouclé / Italian linen / cotton velvet",
        },
        { label: "Feet", value: "Solid walnut, hand-finished" },
      ],
      dimensions: [
        { label: "Width", value: '94" (3-seat) / 124" (sectional)' },
        { label: "Depth", value: '40"' },
        { label: "Height", value: '28"' },
        { label: "Seat height", value: '17"' },
      ],
      features: guarantee,
      care: "Vacuum weekly with an upholstery attachment. Spot-clean with a damp white cloth and mild soap. Professional cleaning recommended for the velvet option.",
      leadTime: "Made to order — ships in 4–6 weeks",
      reviews: [
        {
          author: "Eleanor V.",
          location: "Greenwich, CT",
          rating: 5,
          date: "2026-01-04",
          title: "Indistinguishable from the gallery original",
          body: "We sat on the $9,800 version at a showroom the same week this arrived. Honestly could not tell them apart — same density, same drape. The delivery team assembled it and took the packaging.",
          verified: true,
        },
        {
          author: "Marcus D.",
          location: "Austin, TX",
          rating: 5,
          date: "2025-12-19",
          title: "The down wrap is the real thing",
          body: "I was skeptical at this price. The cushions have that sink-in-then-support feel you only get from a proper feather-down wrap. Three months in, zero sag.",
          verified: true,
        },
        {
          author: "Priya R.",
          location: "Brooklyn, NY",
          rating: 4,
          date: "2025-11-30",
          title: "Stunning — order swatches first",
          body: "The bouclé ivory is gorgeous but lighter than my screen showed. Their swatch box made the final call easy. The sofa itself is flawless.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "cote-slipcover-sofa",
    title: "Côte Slipcover Sofa",
    price: 2950,
    comparableAt: 8500,
    category: "Living",
    collections: ["living", "sofas"],
    createdRank: 9,
    imageIds: [
      "1538688525198-9b88f6f53126",
      "1598300042247-d088f8ab3a91",
      "1583847268964-b28dc8f51f92",
      "1615875605825-5eb9bb5d52ac",
    ],
    description:
      "A deep, slouchy slipcovered sofa in washed Belgian linen. The cover is removable and machine-washable — relaxed luxury that survives real life.",
    options: [
      colorOption(["Washed Flax", "Pebble Grey", "Sand"]),
      sizeOption(['84"', '96"']),
    ],
    meta: {
      tagline: "The Belgian-linen icon, minus the catalog markup.",
      comparableTo:
        "the washed-linen slipcover sofa sold by America's best-known luxury catalog",
      sourcingStory:
        "The famous catalog version is cut and sewn in the same industrial parks in Guangdong that our maker uses — they simply add a 3x markup for the brand on the tag. We buy the identical 100% Belgian flax linen by the bolt and ship direct, so you pay for the linen and the labor, not the logo.",
      designStory:
        "Bench-made seat cushions sit on a webbed hardwood deck so the sofa breaks in evenly. The skirt is cut on the bias so it falls clean without ironing.",
      craftNotes: [
        "100% pre-washed Belgian flax linen, garment-dyed for a lived-in hand",
        "Removable, machine-washable covers on every component",
        "8-way hand-tied seat suspension over a hardwood deck",
      ],
      materials: [
        { label: "Frame", value: "Kiln-dried alder & plywood" },
        { label: "Suspension", value: "8-way hand-tied steel coils" },
        { label: "Cover", value: "100% washed Belgian flax linen" },
        { label: "Fill", value: "Feather-down blend cushions" },
      ],
      dimensions: [
        { label: "Width", value: '84" / 96"' },
        { label: "Depth", value: '42"' },
        { label: "Height", value: '31"' },
        { label: "Seat depth", value: '25"' },
      ],
      features: guarantee,
      care: "Machine wash covers cold, line dry, replace damp for a perfect fit. Wash all cushion covers together to keep the tone even.",
      leadTime: "Made to order — ships in 5–7 weeks",
      reviews: [
        {
          author: "Hannah L.",
          location: "Portland, OR",
          rating: 5,
          date: "2026-01-02",
          title: "Washed the covers, looks even better",
          body: "Two kids and a dog. Pulled the covers off, washed them, and the slight crinkle that came back is exactly the look I wanted. Saved us four thousand dollars over the catalog version.",
          verified: true,
        },
        {
          author: "Theo K.",
          location: "Chicago, IL",
          rating: 5,
          date: "2025-12-08",
          title: "Same linen, half the price",
          body: "I own the catalog one in my old apartment. This is the same fabric weight and the frame feels sturdier if anything.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "aubrey-lounge-chair",
    title: "Aubrey Lounge Chair",
    price: 890,
    comparableAt: 3200,
    category: "Living",
    collections: ["living", "chairs", "new"],
    createdRank: 13,
    imageIds: [
      "1567016432779-094069958ea5",
      "1550581190-9c1c48d21d6c",
      "1556228453-efd6c1ff04f6",
      "1616137466211-f939a420be84",
    ],
    description:
      "A sculptural lounge chair that cradles you at a perfect 28-degree recline. Solid walnut legs, a single-piece molded shell, and a wool-blend seat.",
    options: [colorOption(["Charcoal Wool", "Oat Bouclé", "Cognac Leather"])],
    meta: {
      tagline: "Mid-century gallery sculpture, sourced direct.",
      comparableTo:
        "the womb-style lounge chair found in design museums worldwide",
      sourcingStory:
        "The molded-shell lounge chair has been licensed and re-licensed for seventy years, each license adding cost. We skipped the license and went to the molding workshop in Vietnam that presses shells for three different premium labels, then upholstered it in a New Zealand wool blend.",
      designStory:
        "The shell is pressed in a single operation so there are no seams to fatigue. The recline angle was tuned with a physiotherapist — 28 degrees is where your lower back stops working.",
      craftNotes: [
        "Single-piece molded fiberglass-reinforced shell",
        "New Zealand wool-blend upholstery over molded foam",
        "Solid walnut legs with brass-capped feet",
      ],
      materials: [
        { label: "Shell", value: "Fiberglass-reinforced molded composite" },
        { label: "Legs", value: "Solid American walnut" },
        {
          label: "Upholstery",
          value: "NZ wool blend / bouclé / aniline leather",
        },
      ],
      dimensions: [
        { label: "Width", value: '34"' },
        { label: "Depth", value: '36"' },
        { label: "Height", value: '40"' },
        { label: "Seat height", value: '16"' },
      ],
      features: guarantee,
      care: "Brush wool gently with a soft upholstery brush. Condition leather option twice a year with a neutral cream.",
      leadTime: "In stock — ships in 1 week",
      reviews: [
        {
          author: "Sofia M.",
          location: "Miami, FL",
          rating: 5,
          date: "2025-12-22",
          title: "My favorite chair in the house",
          body: "The recline is exactly right for reading. Compliments from every guest, and nobody believes what I paid.",
          verified: true,
        },
        {
          author: "Daniel W.",
          location: "Seattle, WA",
          rating: 5,
          date: "2025-11-15",
          title: "Walnut legs are the real deal",
          body: "Solid, heavy, beautifully finished. This is not a veneer.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "margaux-boucle-armchair",
    title: "Margaux Bouclé Armchair",
    price: 740,
    comparableAt: 2400,
    category: "Living",
    collections: ["living", "chairs"],
    createdRank: 6,
    imageIds: [
      "1519710164239-da123dc03ef4",
      "1567538096630-e0c55bd6374c",
      "1558211583-d26f610c1eb1",
      "1531835551805-16d864c8d311",
    ],
    description:
      "A plump, rounded armchair in dense ivory bouclé. All curves, no hard edges — the kind of chair you sink into and forget the time.",
    options: [colorOption(["Ivory Bouclé", "Mocha Bouclé", "Sage Bouclé"])],
    meta: {
      tagline: "The curvy designer accent chair, demystified.",
      comparableTo:
        "the rounded bouclé accent chair seen in every design magazine",
      sourcingStory:
        "Bouclé accent chairs became a status symbol and prices tripled overnight. The yarn and the curved-foam technique are not exotic — our maker in Portugal produces the exact dense bouclé used by two boutique brands and we list it at the cost of making it.",
      craftNotes: [
        "Heavyweight 380gsm bouclé with a tight, durable loop",
        "CNC-cut curved foam over a plywood-and-hardwood frame",
        "Hidden swivel-free glides protect floors",
      ],
      materials: [
        { label: "Frame", value: "Hardwood & birch plywood" },
        { label: "Upholstery", value: "380gsm wool-blend bouclé" },
        { label: "Fill", value: "High-resilience molded foam" },
      ],
      dimensions: [
        { label: "Width", value: '32"' },
        { label: "Depth", value: '34"' },
        { label: "Height", value: '30"' },
      ],
      features: guarantee,
      care: "Vacuum the loop gently; never pull a snagged loop — trim it flush with scissors.",
      leadTime: "In stock — ships in 1 week",
      reviews: [
        {
          author: "Camille B.",
          location: "Nashville, TN",
          rating: 5,
          date: "2026-01-09",
          title: "Bouclé is thick and gorgeous",
          body: "I returned a $2,000 version to keep this. The loop is denser.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "noyer-pedestal-dining-table",
    title: "Noyer Pedestal Dining Table",
    price: 1180,
    comparableAt: 4600,
    category: "Dining",
    collections: ["dining", "tables", "new"],
    createdRank: 12,
    imageIds: [
      "1549497538-303791108f95",
      "1551298370-9d3d53740c72",
      "1530018607912-eff2daa1bac4",
      "1616627561839-074385245ff6",
    ],
    description:
      "A single-pedestal dining table with a honed Carrara marble top and a cast aluminum base. Seats four to six without a single leg in the way.",
    options: [
      materialOption(["Carrara Marble", "White Oak"]),
      sizeOption(['48" Round', '54" Round']),
    ],
    meta: {
      tagline: "The tulip-base classic, at a tenth of the gallery price.",
      comparableTo:
        "the mid-century pedestal table that anchors design showrooms",
      sourcingStory:
        "The pedestal table's tooling has been paid off for fifty years, yet licensed versions still cost $4,000+. We cast our base at the same Foshan foundry that pours bases for two licensed makers and pair it with a genuine honed Carrara top quarried in the same Tuscan basin.",
      craftNotes: [
        "Genuine honed Carrara marble, sealed against stains",
        "Single-piece cast aluminum base, powder-coated",
        "Marble top is individually selected for veining",
      ],
      materials: [
        { label: "Top", value: "Honed Carrara marble or solid white oak" },
        { label: "Base", value: "Cast aluminum, matte powder-coat" },
        { label: "Sealant", value: "Penetrating stone sealer (food-safe)" },
      ],
      dimensions: [
        { label: "Diameter", value: '48" / 54"' },
        { label: "Height", value: '29"' },
        { label: "Seats", value: "4–6" },
      ],
      features: guarantee,
      care: "Wipe marble with pH-neutral cleaner. Reseal annually. Use coasters under anything acidic.",
      leadTime: "Made to order — ships in 3–5 weeks",
      reviews: [
        {
          author: "Grace H.",
          location: "Charleston, SC",
          rating: 5,
          date: "2025-12-28",
          title: "Real marble, real weight",
          body: "This is genuine stone — heavy and cool to the touch. The veining on mine is spectacular.",
          verified: true,
        },
        {
          author: "Owen P.",
          location: "Denver, CO",
          rating: 5,
          date: "2025-12-01",
          title: "Saved $3,400",
          body: "Same table my designer quoted me for. Could not justify the gallery price and this is identical.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "brera-oak-dining-table",
    title: "Brera Oak Dining Table",
    price: 1650,
    comparableAt: 5200,
    category: "Dining",
    collections: ["dining", "tables"],
    createdRank: 8,
    imageIds: [
      "1577140917170-285929fb55b7",
      "1567016526105-22da7c13161a",
      "1538688423619-a81d3f23454b",
      "1524758631624-e2822e304c36",
    ],
    description:
      "A solid white-oak plank table with a soft live edge and hand-rubbed oil finish. Built to be handed down, not replaced.",
    options: [sizeOption(['78"', '94"'])],
    meta: {
      tagline: "Heirloom solid oak, direct from the mill.",
      comparableTo:
        "the artisan live-edge tables sold through design galleries",
      sourcingStory:
        "Gallery live-edge tables carry a 'one-of-a-kind' premium even when made in batches. We partner directly with a family mill in Eastern Europe with FSC-certified oak, finishing each top by hand so you get the artisan result without the gallery middleman.",
      craftNotes: [
        "Solid FSC-certified European white oak — not veneer",
        "Hand-rubbed natural oil finish, food-safe",
        "Breadboard ends allow the wood to move with the seasons",
      ],
      materials: [
        { label: "Top", value: 'Solid white oak, 1.6" thick' },
        { label: "Finish", value: "Hand-rubbed plant-based oil" },
        { label: "Base", value: "Solid oak trestle, blackened steel hardware" },
      ],
      dimensions: [
        { label: "Length", value: '78" / 94"' },
        { label: "Width", value: '39"' },
        { label: "Height", value: '30"' },
      ],
      features: guarantee,
      care: "Re-oil once or twice a year. Wipe spills promptly; never leave standing water.",
      leadTime: "Made to order — ships in 6–8 weeks",
      reviews: [
        {
          author: "Isabel T.",
          location: "Santa Fe, NM",
          rating: 5,
          date: "2025-12-14",
          title: "A forever table",
          body: "The oil finish glows. You can feel the grain. This will outlive me.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "mila-dining-chair",
    title: "Mila Dining Chair",
    price: 240,
    comparableAt: 850,
    category: "Dining",
    collections: ["dining", "chairs"],
    createdRank: 5,
    imageIds: [
      "1567538096630-e0c55bd6374c",
      "1519710164239-da123dc03ef4",
      "1549497538-303791108f95",
    ],
    description:
      "A woven-cord seat suspended on a steam-bent solid-oak frame. Light, strong, and impossibly comfortable for a wooden chair.",
    options: [materialOption(["Natural Oak", "Black Oak"])],
    meta: {
      tagline: "The Danish woven classic, fairly priced.",
      comparableTo: "the steam-bent woven-seat chair from the Danish canon",
      sourcingStory:
        "Each authentic version is hand-woven with 120 meters of paper cord — genuinely skilled work that justifies real cost, but not $850. Our Vietnamese workshop trains weavers to the same standard and works directly with us, so you pay for the 90 minutes of weaving, not four layers of distribution.",
      craftNotes: [
        "Hand-woven seat — roughly 120m of paper cord per chair",
        "Steam-bent solid oak back, finger-jointed",
        "Each seat takes a trained weaver about 90 minutes",
      ],
      materials: [
        { label: "Frame", value: "Steam-bent solid oak" },
        { label: "Seat", value: "Hand-woven natural paper cord" },
        { label: "Finish", value: "Matte water-based lacquer" },
      ],
      dimensions: [
        { label: "Width", value: '22"' },
        { label: "Depth", value: '20"' },
        { label: "Height", value: '30"' },
        { label: "Seat height", value: '18"' },
      ],
      features: ["Stackable two-high", ...guarantee.slice(1)],
      care: "Dust the cord with a dry brush. Keep out of prolonged direct sun to avoid yellowing.",
      leadTime: "In stock — ships in 1 week",
      reviews: [
        {
          author: "Lena F.",
          location: "Madison, WI",
          rating: 5,
          date: "2026-01-06",
          title: "Bought six, would buy six more",
          body: "The weave is tight and even. We have the real ones at my parents' house and these hold up beside them.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "eero-molded-chair",
    title: "Eero Molded Chair",
    price: 190,
    comparableAt: 550,
    category: "Dining",
    collections: ["dining", "chairs", "new"],
    createdRank: 11,
    imageIds: [
      "1550581190-9c1c48d21d6c",
      "1567016432779-094069958ea5",
      "1556228453-efd6c1ff04f6",
    ],
    description:
      "A molded seat shell on slim solid-wood dowel legs. The shell flexes just enough to feel comfortable without a cushion.",
    options: [colorOption(["Bone", "Olive", "Graphite"])],
    meta: {
      tagline: "The molded-shell side chair, without the licensing tax.",
      comparableTo:
        "the molded shell-and-dowel chair from the mid-century masters",
      sourcingStory:
        "We use the same recyclable polypropylene shell process and solid-beech dowel legs as the licensed originals — produced at a workshop that already tools shells for premium European retailers — and skip the brand surcharge entirely.",
      craftNotes: [
        "Single-press recyclable polypropylene shell with subtle flex",
        "Solid beech dowel legs with steel cross-brace",
        "Self-leveling floor glides",
      ],
      materials: [
        { label: "Shell", value: "Recyclable polypropylene" },
        { label: "Legs", value: "Solid beech with steel brace" },
      ],
      dimensions: [
        { label: "Width", value: '21"' },
        { label: "Depth", value: '20"' },
        { label: "Height", value: '32"' },
      ],
      features: guarantee.slice(1),
      care: "Wipe shell with a damp cloth. Tighten leg hardware annually.",
      leadTime: "In stock — ships in 1 week",
      reviews: [
        {
          author: "Ben A.",
          location: "Columbus, OH",
          rating: 4,
          date: "2025-12-11",
          title: "Great value, comfy shell",
          body: "Surprisingly comfortable for a hard shell. The wood legs lift the whole look.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "lille-upholstered-bed",
    title: "Lille Upholstered Bed",
    price: 1490,
    comparableAt: 4800,
    category: "Bedroom",
    collections: ["bedroom", "beds"],
    createdRank: 7,
    imageIds: [
      "1505693416388-ac5ce068fe85",
      "1522771739844-6a9f6d5f14af",
      "1540574163026-643ea20ade25",
      "1493106819501-66d381c466f1",
    ],
    description:
      "A low-profile platform bed with a channel-tufted headboard in heavyweight linen. Quiet, grounded, and built around a slatted base that needs no box spring.",
    options: [
      colorOption(["Flax", "Dove", "Charcoal"]),
      sizeOption(["Queen", "King"]),
    ],
    meta: {
      tagline: "The boutique upholstered bed, sourced direct.",
      comparableTo:
        "the channel-tufted platform beds from boutique bedroom brands",
      sourcingStory:
        "Boutique bed brands photograph beautifully and mark up accordingly. The construction — a hardwood frame, foam-wrapped headboard, reinforced slats — is straightforward. We have ours built by a contract maker that produces for two of those exact brands and pass the savings to you.",
      craftNotes: [
        "Hand-tufted channel headboard in 100% linen",
        "Solid hardwood rails with center support legs",
        "Sprung-slat base — no box spring required",
      ],
      materials: [
        { label: "Frame", value: "Solid pine & hardwood" },
        { label: "Headboard", value: "Foam-wrapped, linen-upholstered" },
        { label: "Base", value: "Reinforced sprung slats" },
      ],
      dimensions: [
        { label: "Headboard height", value: '48"' },
        { label: "Footprint", value: "Queen / King" },
        { label: "Clearance", value: '11" under rail' },
      ],
      features: guarantee,
      care: "Vacuum the headboard; spot-clean with mild soap and a damp cloth.",
      leadTime: "Made to order — ships in 4–6 weeks",
      reviews: [
        {
          author: "Nadia S.",
          location: "Boston, MA",
          rating: 5,
          date: "2025-12-20",
          title: "Hotel-quality, no squeaks",
          body: "Assembled in 30 minutes by the delivery team. Rock solid, not a single creak.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "sable-oak-platform-bed",
    title: "Sablé Oak Platform Bed",
    price: 1690,
    comparableAt: 5400,
    category: "Bedroom",
    collections: ["bedroom", "beds", "new"],
    createdRank: 10,
    imageIds: [
      "1540574163026-643ea20ade25",
      "1505693416388-ac5ce068fe85",
      "1493106819501-66d381c466f1",
      "1522771739844-6a9f6d5f14af",
    ],
    description:
      "A solid white-oak platform bed with a floating frame and a low headboard. Japanese-inflected minimalism that warms an entire room.",
    options: [sizeOption(["Queen", "King"])],
    meta: {
      tagline: "Japandi solid-oak minimalism, made attainable.",
      comparableTo:
        "the solid-oak platform beds from high-design Japandi labels",
      sourcingStory:
        "Solid-oak minimalist beds command a premium for their restraint. We use genuine FSC oak — not veneered MDF, as many 'designer' beds quietly are — milled and finished by the same workshop that builds for several Scandinavian brands.",
      craftNotes: [
        "Solid FSC white oak throughout — no MDF cores",
        "Floating frame with concealed steel connectors",
        "Hand-sanded to 320 grit, oil-wax finish",
      ],
      materials: [
        { label: "Frame", value: "Solid white oak" },
        { label: "Finish", value: "Natural oil-wax" },
        { label: "Base", value: "Solid-oak slats" },
      ],
      dimensions: [
        { label: "Headboard height", value: '36"' },
        { label: "Footprint", value: "Queen / King" },
        { label: "Platform height", value: '12"' },
      ],
      features: guarantee,
      care: "Re-apply oil-wax annually. Dust with a dry microfiber cloth.",
      leadTime: "Made to order — ships in 6–8 weeks",
      reviews: [
        {
          author: "Yuki T.",
          location: "San Francisco, CA",
          rating: 5,
          date: "2026-01-11",
          title: "Solid oak, not veneer",
          body: "I checked the end grain — it's the real thing all the way through. Beautiful and substantial.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "marais-travertine-coffee-table",
    title: "Marais Travertine Coffee Table",
    price: 680,
    comparableAt: 2300,
    category: "Living",
    collections: ["living", "tables"],
    createdRank: 4,
    imageIds: [
      "1532372320572-cda25653a26d",
      "1577140917170-285929fb55b7",
      "1538688423619-a81d3f23454b",
    ],
    description:
      "A chunky travertine plinth coffee table with softly radiused edges. One quarried block of stone, honed to a matte, tactile finish.",
    options: [materialOption(["Roman Travertine", "Honed Limestone"])],
    meta: {
      tagline: "The travertine plinth, straight from the quarry region.",
      comparableTo:
        "the monolithic stone coffee tables from luxury design houses",
      sourcingStory:
        "Stone plinth tables are heavy to ship, which is why brands mark them up so steeply. We work with a workshop near the Tivoli travertine quarries in Italy and consolidate freight, so you get genuine Roman travertine without the gallery surcharge.",
      craftNotes: [
        "Genuine Roman travertine, honed and filled",
        "Hand-radiused edges — no sharp corners",
        "Sealed against rings and stains",
      ],
      materials: [
        { label: "Material", value: "Solid Roman travertine / limestone" },
        { label: "Finish", value: "Honed matte, sealed" },
      ],
      dimensions: [
        { label: "Width", value: '43"' },
        { label: "Depth", value: '24"' },
        { label: "Height", value: '13"' },
      ],
      features: guarantee,
      care: "Use coasters. Clean with pH-neutral stone cleaner; reseal yearly.",
      leadTime: "Made to order — ships in 4–6 weeks",
      reviews: [
        {
          author: "Renata C.",
          location: "Los Angeles, CA",
          rating: 5,
          date: "2025-12-05",
          title: "A serious piece of stone",
          body: "It took two of us to move it — exactly what you want. The honed finish feels incredible.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "henri-walnut-sideboard",
    title: "Henri Walnut Sideboard",
    price: 1390,
    comparableAt: 4900,
    category: "Living",
    collections: ["living", "storage", "new"],
    createdRank: 3,
    imageIds: [
      "1538688423619-a81d3f23454b",
      "1567016526105-22da7c13161a",
      "1532372320572-cda25653a26d",
      "1616137466211-f939a420be84",
    ],
    description:
      "A mid-century credenza in book-matched walnut with tambour doors and turned legs. Soft-close hardware hidden behind a purist's facade.",
    options: [],
    meta: {
      tagline: "The book-matched walnut credenza, sourced direct.",
      comparableTo:
        "the mid-century walnut credenzas from collectible design brands",
      sourcingStory:
        "Collectible walnut credenzas trade for thousands because of provenance, not joinery. We commission ours from a cabinet shop in Vietnam that book-matches real walnut veneer over a solid frame and fits soft-close European hardware — the same components the premium brands specify.",
      craftNotes: [
        "Book-matched American walnut veneer over solid frame",
        "Hand-fitted tambour doors that roll on a waxed track",
        "Soft-close European drawer hardware",
      ],
      materials: [
        { label: "Case", value: "Book-matched walnut over hardwood" },
        { label: "Legs", value: "Solid turned walnut" },
        { label: "Hardware", value: "Soft-close European glides" },
      ],
      dimensions: [
        { label: "Width", value: '60"' },
        { label: "Depth", value: '18"' },
        { label: "Height", value: '30"' },
      ],
      features: guarantee,
      care: "Dust with a soft cloth. Keep out of direct sun to preserve the walnut tone.",
      leadTime: "Made to order — ships in 5–7 weeks",
      reviews: [
        {
          author: "Arthur G.",
          location: "Minneapolis, MN",
          rating: 5,
          date: "2025-12-17",
          title: "The tambour doors are mesmerizing",
          body: "Roll like butter. The walnut book-matching is genuinely beautiful. Feels like a $5k piece.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "halo-travertine-side-table",
    title: "Halo Travertine Side Table",
    price: 320,
    comparableAt: 1100,
    category: "Living",
    collections: ["living", "tables"],
    createdRank: 2,
    imageIds: [
      "1532372320572-cda25653a26d",
      "1538688423619-a81d3f23454b",
      "1577140917170-285929fb55b7",
    ],
    description:
      "A cylindrical travertine side table turned from a single core of stone. Small, heavy, and quietly sculptural.",
    options: [],
    meta: {
      tagline: "Solid stone, accent-table price.",
      comparableTo: "the turned-stone side tables from boutique stone studios",
      sourcingStory:
        "Turned from offcuts of the same Roman travertine we use for the Marais table, so a beautiful material that would otherwise be wasted becomes an accessible piece.",
      craftNotes: [
        "Turned from a single core of Roman travertine",
        "Honed and sealed by hand",
        "Felt-padded base protects floors",
      ],
      materials: [
        { label: "Material", value: "Solid Roman travertine" },
        { label: "Finish", value: "Honed matte, sealed" },
      ],
      dimensions: [
        { label: "Diameter", value: '16"' },
        { label: "Height", value: '20"' },
      ],
      features: guarantee.slice(1),
      care: "Use coasters; reseal yearly with stone sealer.",
      leadTime: "In stock — ships in 1 week",
      reviews: [
        {
          author: "Mara D.",
          location: "Phoenix, AZ",
          rating: 5,
          date: "2026-01-03",
          title: "Heavier than expected — in a good way",
          body: "Genuine stone, lovely texture. Perfect beside the sofa.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "lune-pendant-light",
    title: "Lune Pendant Light",
    price: 420,
    comparableAt: 1600,
    category: "Lighting",
    collections: ["lighting", "new"],
    createdRank: 1,
    imageIds: [
      "1513506003901-1e6a229e2d15",
      "1503602642458-232111445657",
      "1567225557594-88d73e55f2cb",
      "1565538810643-b5bdb714032a",
    ],
    description:
      "A hand-folded paper pendant that glows like a paper moon. Warm, diffuse light over a dining table or stairwell.",
    options: [sizeOption(['18"', '24"', '30"'])],
    meta: {
      tagline: "The sculptural paper pendant, made by hand for less.",
      comparableTo: "the iconic mulberry-paper lanterns from the design canon",
      sourcingStory:
        "The original lanterns are still hand-made and still wonderful — and still over a thousand dollars. We commission ours from artisans using the same mulberry-paper-over-bamboo-ribbing technique and sell direct from the workshop.",
      craftNotes: [
        "Hand-folded mulberry paper over bamboo ribbing",
        "Collapsible for shipping — opens to a perfect sphere",
        "Includes dimmable LED-ready cord set",
      ],
      materials: [
        { label: "Shade", value: "Mulberry paper, bamboo ribbing" },
        { label: "Cord", value: "Braided fabric, 6 ft, dimmable" },
      ],
      dimensions: [
        { label: "Diameter", value: '18" / 24" / 30"' },
        { label: "Cord drop", value: "Adjustable to 6 ft" },
      ],
      features: ["Dimmable LED-ready", ...guarantee.slice(1)],
      care: "Dust with a dry, soft brush. Keep dry.",
      leadTime: "In stock — ships in 1 week",
      reviews: [
        {
          author: "Jonah R.",
          location: "Providence, RI",
          rating: 5,
          date: "2025-12-09",
          title: "Beautiful warm glow",
          body: "Looks like the museum version because it basically is. The paper quality is excellent.",
          verified: true,
        },
      ],
    },
  }),
  buildProduct({
    handle: "atelier-arc-floor-lamp",
    title: "Atelier Arc Floor Lamp",
    price: 640,
    comparableAt: 2900,
    category: "Lighting",
    collections: ["lighting"],
    createdRank: 0,
    imageIds: [
      "1503602642458-232111445657",
      "1565538810643-b5bdb714032a",
      "1567225557594-88d73e55f2cb",
      "1513506003901-1e6a229e2d15",
    ],
    description:
      "A sweeping arc floor lamp with a brushed-steel stem, a polished aluminum shade, and a genuine Carrara marble base that anchors the cantilever.",
    options: [colorOption(["Brushed Steel", "Matte Black"])],
    meta: {
      tagline: "The cantilevered arc lamp, honestly priced.",
      comparableTo:
        "the marble-based arc floor lamp from the Italian design canon",
      sourcingStory:
        "The arc lamp's marble base is what drives the original's price — and the freight. We quarry the base from the same Carrara basin and assemble at a lighting workshop that builds for premium European brands, then ship direct.",
      craftNotes: [
        "Genuine Carrara marble base — roughly 40 lbs of ballast",
        "Telescoping brushed-steel arc, adjustable reach",
        "Polished spun-aluminum shade with dimmer",
      ],
      materials: [
        { label: "Base", value: "Solid Carrara marble" },
        { label: "Stem", value: "Brushed stainless steel" },
        { label: "Shade", value: "Spun aluminum, polished" },
      ],
      dimensions: [
        { label: "Height", value: '88"' },
        { label: "Reach", value: 'up to 72"' },
        { label: "Base", value: '10" dia. marble' },
      ],
      features: ["In-line dimmer", ...guarantee.slice(1)],
      care: "Wipe marble with a damp cloth; reseal yearly. Polish aluminum with a microfiber cloth.",
      leadTime: "Made to order — ships in 3–5 weeks",
      reviews: [
        {
          author: "Vera N.",
          location: "Hudson, NY",
          rating: 5,
          date: "2025-12-13",
          title: "The marble base is the real story",
          body: "Substantial, genuine stone. The arc reaches right over the sofa. A showstopper for the price.",
          verified: true,
        },
      ],
    },
  }),
];

const COLLECTION_DEFS: {
  handle: string;
  title: string;
  description: string;
  heroId: string;
}[] = [
  {
    handle: "living",
    title: "Living",
    description:
      "Sofas, lounge chairs, and occasional pieces that make a room feel finished — and considered.",
    heroId: "1618220179428-22790b461013",
  },
  {
    handle: "dining",
    title: "Dining",
    description:
      "Tables and seating built to gather around for decades, not seasons.",
    heroId: "1616627561839-074385245ff6",
  },
  {
    handle: "bedroom",
    title: "Bedroom",
    description:
      "Beds and bedroom pieces engineered for quiet and built to last.",
    heroId: "1505693416388-ac5ce068fe85",
  },
  {
    handle: "lighting",
    title: "Lighting",
    description:
      "Sculptural light, hand-made by the workshops behind the icons.",
    heroId: "1513506003901-1e6a229e2d15",
  },
  {
    handle: "sofas",
    title: "Sofas",
    description:
      "Bench-made seating with feather-down comfort and heirloom frames.",
    heroId: "1555041469-a586c61ea9bc",
  },
  {
    handle: "chairs",
    title: "Chairs",
    description:
      "Lounge, accent, and dining chairs from the ateliers behind the originals.",
    heroId: "1567016432779-094069958ea5",
  },
  {
    handle: "tables",
    title: "Tables",
    description:
      "Stone, oak, and marble tops sourced from the quarries and mills directly.",
    heroId: "1549497538-303791108f95",
  },
  {
    handle: "storage",
    title: "Storage",
    description:
      "Credenzas and sideboards with real walnut and soft-close craft.",
    heroId: "1538688423619-a81d3f23454b",
  },
  {
    handle: "beds",
    title: "Beds",
    description:
      "Upholstered and solid-oak beds, made to order and built to outlast trends.",
    heroId: "1540574163026-643ea20ade25",
  },
  {
    handle: "new",
    title: "New Arrivals",
    description: "The latest pieces to join the Maison Noyer collection.",
    heroId: "1616486338812-3dadae4b4ace",
  },
];

const COLLECTIONS: Collection[] = COLLECTION_DEFS.map((c) => ({
  handle: c.handle,
  title: c.title,
  description: c.description,
  seo: { title: `${c.title} — Maison Noyer`, description: c.description },
  updatedAt,
  path: `/search/${c.handle}`,
}));

export const collectionHero: Record<string, string> = Object.fromEntries(
  COLLECTION_DEFS.map((c) => [c.handle, img(c.heroId)]),
);

function rankOf(p: Product): number {
  return (p as Product & { createdRank?: number }).createdRank ?? 0;
}

export function getLocalProducts(opts?: {
  query?: string;
  sortKey?: string;
  reverse?: boolean;
}): Product[] {
  let list = [...PRODUCTS];
  const q = opts?.query?.toLowerCase().trim();
  if (q) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.meta?.category ?? "").toLowerCase().includes(q),
    );
  }
  switch (opts?.sortKey) {
    case "PRICE":
      list.sort(
        (a, b) =>
          Number(a.priceRange.maxVariantPrice.amount) -
          Number(b.priceRange.maxVariantPrice.amount),
      );
      break;
    case "CREATED":
    case "CREATED_AT":
      list.sort((a, b) => rankOf(b) - rankOf(a));
      break;
    case "BEST_SELLING":
      list.sort(
        (a, b) => (b.meta?.reviewCount ?? 0) - (a.meta?.reviewCount ?? 0),
      );
      break;
    default:
      break;
  }
  if (opts?.reverse) list.reverse();
  return list;
}

export function getLocalProduct(handle: string): Product | undefined {
  return PRODUCTS.find((p) => p.handle === handle);
}

export function getLocalCollection(handle: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.handle === handle);
}

export function getLocalCollections(): Collection[] {
  return COLLECTIONS;
}

export function getLocalCollectionProducts(opts: {
  collection: string;
  sortKey?: string;
  reverse?: boolean;
}): Product[] {
  const { collection } = opts;
  let list: Product[];
  if (collection === "hidden-homepage-featured-items") {
    list = [
      getLocalProduct("lina-modular-sofa"),
      getLocalProduct("noyer-pedestal-dining-table"),
      getLocalProduct("aubrey-lounge-chair"),
    ].filter(Boolean) as Product[];
  } else if (collection === "hidden-homepage-carousel") {
    list = getLocalProducts({ sortKey: "BEST_SELLING" });
  } else if (!collection || collection === "all") {
    list = getLocalProducts({});
  } else {
    list = PRODUCTS.filter((p) => p.tags.includes(collection));
  }
  if (opts.sortKey) {
    list = [...list];
    if (opts.sortKey === "PRICE") {
      list.sort(
        (a, b) =>
          Number(a.priceRange.maxVariantPrice.amount) -
          Number(b.priceRange.maxVariantPrice.amount),
      );
    } else if (opts.sortKey === "CREATED" || opts.sortKey === "CREATED_AT") {
      list.sort((a, b) => rankOf(b) - rankOf(a));
    } else if (opts.sortKey === "BEST_SELLING") {
      list.sort(
        (a, b) => (b.meta?.reviewCount ?? 0) - (a.meta?.reviewCount ?? 0),
      );
    }
  }
  if (opts.reverse) list.reverse();
  return list;
}

export function getLocalRecommendations(handle: string): Product[] {
  const current = getLocalProduct(handle);
  if (!current) return PRODUCTS.slice(0, 4);
  const cat = current.meta?.category;
  return PRODUCTS.filter((p) => p.handle !== handle)
    .sort((a, b) => {
      const aMatch = a.meta?.category === cat ? 0 : 1;
      const bMatch = b.meta?.category === cat ? 0 : 1;
      return aMatch - bMatch;
    })
    .slice(0, 4);
}

export const NAV_MENU = [
  { title: "Living", path: "/search/living" },
  { title: "Dining", path: "/search/dining" },
  { title: "Bedroom", path: "/search/bedroom" },
  { title: "Lighting", path: "/search/lighting" },
  { title: "New Arrivals", path: "/search/new" },
  { title: "Our Sourcing", path: "/sourcing" },
];

export const FOOTER_MENU = [
  { title: "Living", path: "/search/living" },
  { title: "Dining", path: "/search/dining" },
  { title: "Bedroom", path: "/search/bedroom" },
  { title: "Lighting", path: "/search/lighting" },
  { title: "Our Sourcing", path: "/sourcing" },
  { title: "Trade Program", path: "/sourcing" },
];

export type MegaColumn = {
  heading: string;
  links: { title: string; path: string }[];
};

export type MegaItem = {
  title: string;
  path: string;
  columns?: MegaColumn[];
  featured?: { title: string; subtitle: string; image: string; path: string };
};

export const MEGA_MENU: MegaItem[] = [
  {
    title: "Living",
    path: "/search/living",
    columns: [
      {
        heading: "Seating",
        links: [
          { title: "Sofas", path: "/search/sofas" },
          { title: "Lounge & Accent Chairs", path: "/search/chairs" },
          { title: "All Living", path: "/search/living" },
        ],
      },
      {
        heading: "Occasional",
        links: [
          { title: "Coffee & Side Tables", path: "/search/tables" },
          { title: "Sideboards & Storage", path: "/search/storage" },
        ],
      },
    ],
    featured: {
      title: "Lina Modular Sofa",
      subtitle: "The sculptural Italian modular",
      image: img("1555041469-a586c61ea9bc", 900),
      path: "/product/lina-modular-sofa",
    },
  },
  {
    title: "Dining",
    path: "/search/dining",
    columns: [
      {
        heading: "Tables",
        links: [
          { title: "Dining Tables", path: "/search/tables" },
          { title: "All Dining", path: "/search/dining" },
        ],
      },
      {
        heading: "Seating",
        links: [{ title: "Dining Chairs", path: "/search/chairs" }],
      },
    ],
    featured: {
      title: "Noyer Pedestal Table",
      subtitle: "Honed Carrara, single pedestal",
      image: img("1549497538-303791108f95", 900),
      path: "/product/noyer-pedestal-dining-table",
    },
  },
  {
    title: "Bedroom",
    path: "/search/bedroom",
    columns: [
      {
        heading: "Beds",
        links: [
          { title: "Upholstered Beds", path: "/search/beds" },
          { title: "Solid Oak Beds", path: "/search/beds" },
          { title: "All Bedroom", path: "/search/bedroom" },
        ],
      },
    ],
    featured: {
      title: "Lille Upholstered Bed",
      subtitle: "Channel-tufted Belgian linen",
      image: img("1505693416388-ac5ce068fe85", 900),
      path: "/product/lille-upholstered-bed",
    },
  },
  {
    title: "Lighting",
    path: "/search/lighting",
    columns: [
      {
        heading: "Shop Lighting",
        links: [
          { title: "Pendant Lights", path: "/product/lune-pendant-light" },
          { title: "Floor Lamps", path: "/product/atelier-arc-floor-lamp" },
          { title: "All Lighting", path: "/search/lighting" },
        ],
      },
    ],
    featured: {
      title: "Lune Pendant",
      subtitle: "Hand-folded mulberry paper",
      image: img("1513506003901-1e6a229e2d15", 900),
      path: "/product/lune-pendant-light",
    },
  },
  { title: "New Arrivals", path: "/search/new" },
  { title: "Our Sourcing", path: "/sourcing" },
];

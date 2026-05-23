"use client";

import clsx from "clsx";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import { useRouter, useSearchParams } from "next/navigation";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

// Map a fabric/finish color name to a representative swatch color.
const SWATCH_MAP: Record<string, string> = {
  "bouclé ivory": "#ece4d3",
  "ivory bouclé": "#ece4d3",
  bone: "#ece6d8",
  flax: "#ddccab",
  "washed flax": "#dccdb0",
  "camel linen": "#c2a274",
  "oat bouclé": "#d8ccb2",
  sand: "#d6c29c",
  "espresso velvet": "#463526",
  "cognac leather": "#8a4a28",
  "mocha bouclé": "#8a6b52",
  "charcoal wool": "#3a3a38",
  charcoal: "#3a3a38",
  graphite: "#42434a",
  "matte black": "#272727",
  "pebble grey": "#b4afa6",
  dove: "#cbc6bb",
  "brushed steel": "#b7bbc0",
  "sage bouclé": "#9aa07e",
  olive: "#6f7257",
};

function swatchColor(value: string): string {
  const key = value.toLowerCase();
  if (SWATCH_MAP[key]) return SWATCH_MAP[key];
  // Keyword fallbacks so unknown names still render sensibly.
  if (/ivory|bone|cream|flax|oat|natural/.test(key)) return "#e6dcc7";
  if (/black|graphite|charcoal|espresso|ebony/.test(key)) return "#2f2f2e";
  if (/grey|gray|pebble|dove|stone|steel/.test(key)) return "#bdb8af";
  if (/sage|olive|green|moss/.test(key)) return "#8d937a";
  if (/camel|cognac|tan|mocha|walnut|caramel/.test(key)) return "#9c7450";
  if (/sand|beige|wheat/.test(key)) return "#d6c29c";
  return "#cfc4b0";
}

export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  const updateOption = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return options.map((option) => {
    const optionNameLowerCase = option.name.toLowerCase();
    const isColor = optionNameLowerCase === "color";
    const selectedValue = searchParams.get(optionNameLowerCase);

    const availabilityFor = (value: string) => {
      const optionParams: Record<string, string> = {};
      searchParams.forEach((v, k) => (optionParams[k] = v));
      optionParams[optionNameLowerCase] = value;
      const filtered = Object.entries(optionParams).filter(([key, val]) =>
        options.find(
          (o) => o.name.toLowerCase() === key && o.values.includes(val),
        ),
      );
      return Boolean(
        combinations.find((combination) =>
          filtered.every(
            ([key, val]) =>
              combination[key] === val && combination.availableForSale,
          ),
        ),
      );
    };

    return (
      <form key={option.id}>
        <dl className="mb-7">
          <dt className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-clay">
            <span>{option.name}</span>
            {isColor && selectedValue ? (
              <span className="normal-case tracking-normal text-ink">
                — {selectedValue}
              </span>
            ) : null}
          </dt>
          <dd className="flex flex-wrap gap-2.5">
            {option.values.map((value) => {
              const isAvailableForSale = availabilityFor(value);
              const isActive = selectedValue === value;

              if (isColor) {
                return (
                  <button
                    key={value}
                    formAction={() => updateOption(optionNameLowerCase, value)}
                    aria-label={value}
                    aria-disabled={!isAvailableForSale}
                    disabled={!isAvailableForSale}
                    title={`${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                    className={clsx(
                      "relative h-9 w-9 rounded-full border transition-all duration-200",
                      isActive
                        ? "border-bone ring-2 ring-ink ring-offset-1 ring-offset-bone"
                        : "border-stone/40 hover:ring-1 hover:ring-ink hover:ring-offset-1 hover:ring-offset-bone",
                      !isAvailableForSale && "cursor-not-allowed opacity-40",
                    )}
                    style={{ backgroundColor: swatchColor(value) }}
                  >
                    {!isAvailableForSale ? (
                      <span className="absolute left-1/2 top-1/2 h-px w-10 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-stone" />
                    ) : null}
                  </button>
                );
              }

              return (
                <button
                  key={value}
                  formAction={() => updateOption(optionNameLowerCase, value)}
                  aria-disabled={!isAvailableForSale}
                  disabled={!isAvailableForSale}
                  title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                  className={clsx(
                    "flex min-w-[52px] items-center justify-center border px-4 py-2.5 text-sm transition-all duration-200",
                    {
                      "cursor-default border-ink bg-ink text-bone": isActive,
                      "border-sand bg-bone text-ink hover:border-ink":
                        !isActive && isAvailableForSale,
                      "relative z-10 cursor-not-allowed overflow-hidden border-sand bg-cream text-stone before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-12 before:bg-stone":
                        !isAvailableForSale,
                    },
                  )}
                >
                  {value}
                </button>
              );
            })}
          </dd>
        </dl>
      </form>
    );
  });
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { MegaItem } from "lib/data/catalog";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function MegaMenu({ items }: { items: MegaItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const activeItem = items.find((i) => i.title === active && i.columns);

  return (
    <div
      className="relative hidden md:block"
      onMouseLeave={() => setActive(null)}
    >
      <ul className="flex items-center justify-center gap-9">
        {items.map((item) => {
          const isActive =
            pathname === item.path || (active === item.title && item.columns);
          return (
            <li key={item.title} onMouseEnter={() => setActive(item.title)}>
              <Link
                href={item.path}
                prefetch={true}
                onFocus={() => setActive(item.title)}
                className={clsx(
                  "relative block py-1 text-xs font-medium uppercase tracking-[0.18em] transition-colors",
                  "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-brass after:transition-all after:duration-300",
                  isActive
                    ? "text-ink after:w-full"
                    : "text-ink/65 after:w-0 hover:text-ink hover:after:w-full",
                )}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {activeItem ? (
          <motion.div
            key={activeItem.title}
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full z-50 pt-3"
          >
            <div className="grid grid-cols-[1.5fr_1fr] gap-12 overflow-hidden rounded-2xl bg-bone p-8 shadow-[0_24px_50px_-24px_rgba(27,37,26,0.45)] lg:gap-16 lg:p-10">
              <div className="grid grid-cols-2 gap-10">
                {activeItem.columns!.map((col) => (
                  <div key={col.heading}>
                    <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-clay">
                      {col.heading}
                    </p>
                    <ul className="space-y-3">
                      {col.links.map((link) => (
                        <li key={link.title}>
                          <Link
                            href={link.path}
                            prefetch={true}
                            className="font-serif text-lg text-ink transition-colors hover:text-clay"
                          >
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {activeItem.featured ? (
                <Link
                  href={activeItem.featured.path}
                  prefetch={true}
                  className="group relative block overflow-hidden bg-cream"
                >
                  <div className="img-hover-zoom relative aspect-[5/4] w-full overflow-hidden">
                    <Image
                      src={activeItem.featured.image}
                      alt={activeItem.featured.title}
                      fill
                      sizes="320px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-bone/70">
                      Featured
                    </p>
                    <p className="mt-1 font-serif text-xl text-bone">
                      {activeItem.featured.title}
                    </p>
                    <p className="text-xs text-bone/75">
                      {activeItem.featured.subtitle}
                    </p>
                  </div>
                </Link>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

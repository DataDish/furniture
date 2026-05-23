"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useState } from "react";

export type AccordionItem = {
  title: string;
  content: ReactNode;
};

export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<Set<number>>(
    new Set(defaultOpen === null ? [] : [defaultOpen]),
  );

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div className="border-t border-sand">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={item.title} className="border-b border-sand">
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink">
                {item.title}
              </span>
              {isOpen ? (
                <MinusIcon className="h-4 w-4 text-clay" />
              ) : (
                <PlusIcon className="h-4 w-4 text-clay" />
              )}
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 text-sm leading-relaxed text-walnut">
                    {item.content}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

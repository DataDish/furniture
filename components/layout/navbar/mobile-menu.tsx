"use client";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, Suspense, useEffect, useState } from "react";

import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Wordmark } from "components/wordmark";
import { MEGA_MENU } from "lib/data/catalog";
import { AnimatePresence, motion } from "motion/react";
import Search, { SearchSkeleton } from "./search";

export default function MobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center text-ink transition-colors md:hidden"
      >
        <Bars3Icon strokeWidth={1.25} className="h-6" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-ink/40" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 top-0 flex h-full w-full max-w-sm flex-col bg-bone text-ink">
              <div className="flex items-center justify-between border-b border-sand p-5">
                <Wordmark subtitle={false} />
                <button
                  className="flex h-10 w-10 items-center justify-center text-ink"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                >
                  <XMarkIcon strokeWidth={1.25} className="h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-8">
                <div className="my-6 w-full">
                  <Suspense fallback={<SearchSkeleton />}>
                    <Search />
                  </Suspense>
                </div>

                <ul className="flex w-full flex-col">
                  {MEGA_MENU.map((item) => {
                    const hasChildren = Boolean(item.columns?.length);
                    const isExpanded = expanded === item.title;

                    if (!hasChildren) {
                      return (
                        <li
                          key={item.title}
                          className="border-b border-sand/60"
                        >
                          <Link
                            href={item.path}
                            prefetch={true}
                            onClick={closeMobileMenu}
                            className="block py-4 font-serif text-2xl text-ink"
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    }

                    return (
                      <li key={item.title} className="border-b border-sand/60">
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() =>
                            setExpanded(isExpanded ? null : item.title)
                          }
                          className="flex w-full items-center justify-between py-4 text-left font-serif text-2xl text-ink"
                        >
                          {item.title}
                          <ChevronDownIcon
                            className={`h-5 w-5 text-clay transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isExpanded ? (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <ul className="space-y-1 pb-4 pl-1">
                                <li>
                                  <Link
                                    href={item.path}
                                    prefetch={true}
                                    onClick={closeMobileMenu}
                                    className="block py-2 text-sm font-medium uppercase tracking-[0.12em] text-clay"
                                  >
                                    Shop all {item.title}
                                  </Link>
                                </li>
                                {item.columns!.flatMap((col) =>
                                  col.links.map((link) => (
                                    <li key={`${col.heading}-${link.title}`}>
                                      <Link
                                        href={link.path}
                                        prefetch={true}
                                        onClick={closeMobileMenu}
                                        className="block py-2 text-base text-walnut"
                                      >
                                        {link.title}
                                      </Link>
                                    </li>
                                  )),
                                )}
                              </ul>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

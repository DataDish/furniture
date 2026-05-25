"use client";

import CartModal from "components/cart/modal";
import { Wordmark } from "components/wordmark";
import { MEGA_MENU } from "lib/data/catalog";
import clsx from "clsx";
import { Suspense, useEffect, useState } from "react";
import { MegaMenu } from "./mega-menu";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const ANNOUNCEMENTS = [
  "Complimentary white-glove delivery & assembly on every order",
  "100-night in-home trial · Lifetime warranty on frames",
  "Sourced direct from the ateliers behind the icons",
];

export default function NavbarClient() {
  const [scrolled, setScrolled] = useState(false);
  const [announce, setAnnounce] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setAnnounce((a) => (a + 1) % ANNOUNCEMENTS.length),
      4500,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <div className="overflow-hidden bg-ink text-bone">
        <p
          key={announce}
          className="animate-[fadeIn_0.6s_ease] px-4 py-2 text-center text-[10px] uppercase tracking-[0.18em] sm:text-[11px] sm:tracking-[0.22em]"
        >
          {ANNOUNCEMENTS[announce]}
        </p>
      </div>

      <header
        className={clsx(
          "border-b transition-all duration-300",
          scrolled
            ? "border-sand bg-bone/92 backdrop-blur-md"
            : "border-transparent bg-bone",
        )}
      >
        {/* Row 1: wordmark + utilities */}
        <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-4 py-4 lg:px-8">
          <div className="flex items-center justify-start md:hidden">
            <MobileMenu />
          </div>
          <div className="hidden md:block" />

          <div className="flex justify-center">
            <Wordmark className="items-center text-center text-ink" />
          </div>

          <div className="flex items-center justify-end gap-4">
            <div className="hidden w-40 lg:block">
              <Suspense fallback={<SearchSkeleton />}>
                <Search />
              </Suspense>
            </div>
            <CartModal />
          </div>
        </div>

        {/* Row 2: primary nav with mega menu (desktop) */}
        <div className="hidden border-t border-sand/60 py-3 md:block">
          <MegaMenu items={MEGA_MENU} />
        </div>
      </header>
    </div>
  );
}

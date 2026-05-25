"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import CartModal from "components/cart/modal";
import { Wordmark } from "components/wordmark";
import { MEGA_MENU } from "lib/data/catalog";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  // On the homepage the header floats over the full-bleed hero (fixed/overlay).
  // Elsewhere it floats in normal flow (sticky) so it doesn't cover content.
  const isHome = pathname === "/";

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
    <div
      className={clsx(
        "inset-x-0 top-0 z-50 px-3 py-3 sm:px-4 sm:py-4",
        isHome ? "fixed" : "sticky",
      )}
    >
      <div
        className={clsx(
          "mx-auto max-w-[1400px] rounded-2xl text-ink shadow-[0_10px_40px_-18px_rgba(27,37,26,0.35)] backdrop-blur-md transition-colors duration-300",
          scrolled ? "bg-bone/90" : "bg-bone/80",
        )}
      >
        {/* Announcement strip — collapses on scroll */}
        <div
          className={clsx(
            "overflow-hidden transition-all duration-300",
            scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
          )}
        >
          <div className="rounded-t-2xl bg-ink text-bone">
            <p
              key={announce}
              className="animate-[fadeIn_0.6s_ease] px-4 py-2 text-center text-[10px] uppercase tracking-[0.18em] sm:text-[11px] sm:tracking-[0.22em]"
            >
              {ANNOUNCEMENTS[announce]}
            </p>
          </div>
        </div>

        {/* Row 1: wordmark + utilities */}
        <div
          className={clsx(
            "mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-4 transition-all duration-300 lg:px-8",
            scrolled ? "py-2.5" : "py-4",
          )}
        >
          <div className="flex items-center justify-start md:hidden">
            <MobileMenu />
          </div>
          <div className="hidden md:block" />

          <div className="flex justify-center">
            <Wordmark
              subtitle={!scrolled}
              className="items-center text-center text-ink"
            />
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <div className="hidden w-40 lg:block">
              <Suspense fallback={<SearchSkeleton />}>
                <Search />
              </Suspense>
            </div>
            <Link
              href="/account"
              aria-label="Account"
              className="flex h-11 w-11 items-center justify-center text-ink transition-colors"
            >
              <UserIcon strokeWidth={1.25} className="h-5" />
            </Link>
            <CartModal />
          </div>
        </div>

        {/* Row 2: primary nav with mega menu (desktop) */}
        <div
          className={clsx(
            "hidden border-t border-sand/40 transition-all duration-300 md:block",
            scrolled ? "py-2" : "py-3",
          )}
        >
          <MegaMenu items={MEGA_MENU} />
        </div>
      </div>
    </div>
  );
}

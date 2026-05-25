"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function Hero({ image }: { image: string }) {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={image}
          alt="A Maison Noyer living room"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/10" />

      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-16 lg:px-8 lg:pb-24">
        <motion.p
          {...rise(0.2)}
          className="mb-5 text-xs uppercase tracking-[0.35em] text-bone/80"
        >
          The Atelier-Direct Furniture House
        </motion.p>
        <motion.h1
          {...rise(0.35)}
          className="max-w-3xl font-serif text-4xl leading-[1.05] text-bone md:text-5xl lg:text-6xl"
        >
          The pieces you covet.
          <br />
          Without the markup.
        </motion.h1>
        <motion.p
          {...rise(0.5)}
          className="mt-6 max-w-xl text-base leading-relaxed text-bone/85 md:text-lg"
        >
          We commission gallery-grade furniture from the same ateliers that
          supply the world's most celebrated design houses — and bring it to you
          directly, at a fraction of the gallery price.
        </motion.p>
        <motion.div {...rise(0.65)} className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/search"
            className="bg-bone px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-cream"
          >
            Shop the Collection
          </Link>
          <Link
            href="/sourcing"
            className="border border-bone/40 px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:bg-bone/10"
          >
            How We Source
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

import Footer from "components/layout/footer";
import clsx from "clsx";
import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
  wide = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <>
      <section className="border-b border-sand bg-cream">
        <div className="mx-auto max-w-[820px] px-4 py-16 text-center lg:py-24">
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.3em] text-clay">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
            {title}
          </h1>
          {intro ? (
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-walnut md:text-lg">
              {intro}
            </p>
          ) : null}
        </div>
      </section>

      <div
        className={clsx(
          "mx-auto px-4 py-16 lg:py-20",
          wide ? "max-w-[1100px]" : "max-w-[760px]",
        )}
      >
        {children}
      </div>

      <Footer />
    </>
  );
}

export type ContentSection = { heading: string; body: string | string[] };

export function ContentSections({ sections }: { sections: ContentSection[] }) {
  return (
    <div>
      {sections.map((s) => (
        <div
          key={s.heading}
          className="mt-10 border-t border-sand pt-10 first:mt-0 first:border-t-0 first:pt-0"
        >
          <h2 className="font-serif text-2xl text-ink">{s.heading}</h2>
          {(Array.isArray(s.body) ? s.body : [s.body]).map((p, i) => (
            <p key={i} className="mt-3 text-base leading-relaxed text-walnut">
              {p}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

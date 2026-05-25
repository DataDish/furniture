import Image from "next/image";

/** Full-bleed lifestyle image used to break up the PDP with a room shot. */
export function LifestyleBanner({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
      <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      {caption ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
          <p className="absolute bottom-8 left-1/2 max-w-2xl -translate-x-1/2 px-4 text-center font-serif text-2xl leading-snug text-bone md:text-3xl">
            {caption}
          </p>
        </>
      ) : null}
    </section>
  );
}

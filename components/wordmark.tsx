import clsx from "clsx";
import Link from "next/link";

export function Wordmark({
  className,
  href = "/",
  subtitle = true,
}: {
  className?: string;
  href?: string;
  subtitle?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      aria-label="Maison Noyer — home"
      className={clsx("group inline-flex flex-col leading-none", className)}
    >
      <span className="font-serif text-xl tracking-[0.18em] uppercase md:text-2xl">
        Maison Noyer
      </span>
      {subtitle ? (
        <span className="mt-1 text-[10px] uppercase tracking-[0.35em] opacity-60">
          Atelier Direct
        </span>
      ) : null}
    </Link>
  );
}

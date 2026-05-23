export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8">
      <ul className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <li key={index}>
              <div className="aspect-[4/5] w-full animate-pulse bg-cream" />
              <div className="mt-4 h-3 w-1/3 animate-pulse bg-cream" />
              <div className="mt-2 h-4 w-2/3 animate-pulse bg-cream" />
            </li>
          ))}
      </ul>
    </div>
  );
}

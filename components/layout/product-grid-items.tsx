import { Reveal } from "components/motion/reveal";
import { ProductCard } from "components/product/product-card";
import { Product } from "lib/shopify/types";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product, i) => (
        <Reveal as="li" key={product.handle} delay={(i % 2) * 0.08}>
          <ProductCard
            product={product}
            priority={i < 2}
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        </Reveal>
      ))}
    </>
  );
}

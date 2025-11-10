import ProductCard from "./productCard";
import { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
  onToggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  onDelete: (productId: number) => void;
  lastProductRef?: (node: HTMLDivElement) => void;
}

export default function ProductList({
  products,
  onToggleFavorite,
  isFavorite,
  onDelete,
  lastProductRef,
}: ProductListProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p, index) => {
        // Add ref to the last element for infinite scroll if the ref is provided
        if (lastProductRef && products.length === index + 1) {
          return (
            <div ref={lastProductRef} key={p.id}>
              <ProductCard
                product={p}
                onToggleFavorite={() => onToggleFavorite(p)}
                isFavorite={isFavorite(p.id)}
                onDelete={onDelete}
              />
            </div>
          );
        } else {
          return (
            <ProductCard
              key={p.id}
              product={p}
              onToggleFavorite={() => onToggleFavorite(p)}
              isFavorite={isFavorite(p.id)}
              onDelete={onDelete}
            />
          );
        }
      })}
    </div>
  );
}

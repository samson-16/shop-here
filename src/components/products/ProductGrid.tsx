"use client";

import { motion } from "framer-motion";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onToggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  onDelete: (productId: number) => void;
  lastProductRef?: (node: HTMLDivElement) => void;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ProductGrid({
  products,
  onToggleFavorite,
  isFavorite,
  onDelete,
  lastProductRef,
}: ProductGridProps) {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product, index) => {
        const isLastProduct = lastProductRef && products.length === index + 1;

        if (isLastProduct) {
          return (
            <div ref={lastProductRef} key={product.id}>
              <ProductCard
                product={product}
                onToggleFavorite={() => onToggleFavorite(product)}
                isFavorite={isFavorite(product.id)}
                onDelete={onDelete}
              />
            </div>
          );
        }

        return (
          <ProductCard
            key={product.id}
            product={product}
            onToggleFavorite={() => onToggleFavorite(product)}
            isFavorite={isFavorite(product.id)}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}

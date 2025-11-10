"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts, deleteProduct } from "@/redux/features/productSlice";
import {
  ProductGrid,
  ProductSkeletonGrid,
  SearchBar,
  CategoryFilter,
} from "@/components/products";
import { PageHeader } from "@/components/layout";
import { FadeIn, ScaleIn } from "@/components/animations";
import { useFavorites } from "@/hooks";
import { PAGINATION, TOAST_MESSAGES } from "@/constants";
import toast from "react-hot-toast";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { list, status, hasMore } = useAppSelector((state) => state.products);
  const { isFavorite, handleToggleFavorite } = useFavorites();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [skip, setSkip] = useState(0);

  const observer = useRef<IntersectionObserver | null>(null);
  const prevQueryRef = useRef(query);
  const prevCategoryRef = useRef(category);

  // Fetch products with debounce for search
  useEffect(() => {
    const isFilterChange =
      prevQueryRef.current !== query || prevCategoryRef.current !== category;

    if (isFilterChange) {
      prevQueryRef.current = query;
      prevCategoryRef.current = category;
      setSkip(0);
    }

    const timer = setTimeout(
      () => {
        dispatch(fetchProducts({ query, category, skip }));
      },
      isFilterChange ? 500 : 0
    );

    return () => clearTimeout(timer);
  }, [query, category, skip, dispatch]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setQuery("");
  };

  const handleDelete = async (productId: number) => {
    const product = list.find((p) => p.id === productId);
    const result = await dispatch(deleteProduct(productId));

    if (result.meta.requestStatus === "fulfilled") {
      toast.success(
        TOAST_MESSAGES.PRODUCT_DELETED(product?.title || "Product")
      );
    } else {
      toast.error(TOAST_MESSAGES.DELETE_FAILED);
    }
  };

  // Intersection Observer for infinite scroll
  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (status === "loading") return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !query) {
            setSkip((prev) => prev + PAGINATION.PRODUCTS_PER_PAGE);
          }
        },
        { rootMargin: "200px" }
      );

      if (node) observer.current.observe(node);
    },
    [status, hasMore, query, skip]
  );

  return (
    <main className="p-6">
      <FadeIn>
        <PageHeader title="Products" />
      </FadeIn>

      {/* Filter and Search Side by Side */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <CategoryFilter
              selectedCategory={category}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          <div className="w-full md:w-1/2">
            <SearchBar value={query} onChange={setQuery} />
          </div>
        </div>
      </FadeIn>

      {status === "loading" && list.length === 0 ? (
        <ProductSkeletonGrid count={PAGINATION.PRODUCTS_PER_PAGE} />
      ) : list.length === 0 ? (
        <ScaleIn>
          <div className="text-center py-10 text-muted-foreground">
            <p>No products found.</p>
          </div>
        </ScaleIn>
      ) : (
        <ProductGrid
          products={list}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
          onDelete={handleDelete}
          lastProductRef={lastProductRef}
        />
      )}

      {status === "loading" && list.length > 0 && (
        <FadeIn>
          <p className="text-center mt-10">Loading more...</p>
        </FadeIn>
      )}
      {/* {!hasMore && list.length > 0 && (
        <FadeIn>
          <p className="text-center mt-10 text-muted-foreground">
            You've reached the end. (Total: {list.length} products)
          </p>
        </FadeIn>
      )} */}
    </main>
  );
}

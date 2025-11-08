"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { Product } from "@/types/product";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/skeletonCard";
import ProductCard from "@/components/productCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleFavorite } from "@/redux/features/favoritesSlice";
import { deleteProduct } from "@/redux/features/productSlice";
import { ArrowLeft, Heart, Star } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites);

  const productsInStore = useAppSelector((state) => state.products.list);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        // First check if product exists in Redux store
        const productInStore = productsInStore.find((p) => p.id === Number(id));
        if (productInStore) {
          setProduct(productInStore);
          setSelectedImage(productInStore.thumbnail);
          setLoading(false);
          return;
        }

        // If not in store, fetch from API
        const { data } = await axiosInstance.get<Product>(`/products/${id}`);
        setProduct(data);
        setSelectedImage(data.thumbnail);
      } catch (err: any) {
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, productsInStore]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      try {
        setLoadingRelated(true);
        const { data } = await axiosInstance.get<ApiResponse>(
          `/products/category/${product.category}?limit=4`
        );
        // Exclude the current product
        const filtered = data.products.filter((p) => p.id !== product.id);
        setRelatedProducts(filtered);
      } catch (err: any) {
        console.error("Failed to fetch related products:", err);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const handleToggleFavorite = (productId: number) => {
    const prod = relatedProducts.find((p) => p.id === productId) || product;
    if (prod) {
      const isFav = favorites.some((p) => p.id === prod.id);
      dispatch(toggleFavorite(prod));
      if (isFav) {
        toast.success("Removed from favorites");
      } else {
        toast.success("Added to favorites");
      }
    }
  };

  const handleToggleCurrentFavorite = () => {
    if (product) {
      const isFav = favorites.some((p) => p.id === product.id);
      dispatch(toggleFavorite(product));
      if (isFav) {
        toast.success("Removed from favorites");
      } else {
        toast.success("Added to favorites");
      }
    }
  };

  const handleDelete = async (productId: number) => {
    const prod = relatedProducts.find((p) => p.id === productId);
    const result = await dispatch(deleteProduct(productId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(`${prod?.title || "Product"} deleted successfully`);
    } else {
      toast.error("Failed to delete product");
    }
  };

  const isFavorite = (productId: number) => {
    return favorites.some((p) => p.id === productId);
  };

  if (loading) {
    return (
      <main className="p-6">
        <SkeletonCard />
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="p-6">
        <div className="text-center">
          <p>Product not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Product Details Section */}
      <div className="container mx-auto px-8 py-6 max-w-7xl">
        {/* Go Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 mb-8 px-0 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="shrink-0"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative w-full lg:w-[480px] h-[480px] bg-muted/20 rounded-lg overflow-hidden flex items-center justify-center"
            >
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                className="object-contain p-12"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 max-w-2xl"
          >
            <div className="space-y-3">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-muted-foreground"
              >
                {product.category}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold leading-tight"
              >
                {product.title}
              </motion.h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-3xl font-bold">${product.price}</span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium text-foreground">
                    {product.rating}
                  </span>
                </div>
                <Badge
                  variant="default"
                  className="bg-black text-white hover:bg-black text-xs"
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of Stock"}
                </Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed text-base pt-2">
                {product.description}
              </p>
            </div>

            {/* Details Section */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-3">Details:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Brand: </span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Stock: </span>
                  <span className="font-medium">{product.stock} units</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Category: </span>
                  <span className="font-medium">{product.category}</span>
                </div>
              </div>
            </div>

            {/* Add to Favorites Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full gap-2 h-11 mt-6"
                onClick={handleToggleCurrentFavorite}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite(product.id) ? "fill-current text-red-500" : ""
                  }`}
                />
                Add to Favorites
              </Button>
            </motion.div>

            {/* Login Message */}
            {/* <div className="bg-muted/40 p-4 rounded-md text-center text-sm text-muted-foreground mt-4">
              Please login to add items to cart or favorites
            </div> */}
          </motion.div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">Related Products</h2>
              <p className="text-sm text-muted-foreground">
                Other products in {product.category}
              </p>
            </div>
            {loadingRelated ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.slice(0, 3).map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    isFavorite={isFavorite(relatedProduct.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

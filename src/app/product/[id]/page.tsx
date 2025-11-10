"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonCard } from "@/components/skeletonCard";
import ProductCard from "@/components/productCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleFavorite } from "@/redux/features/favoritesSlice";
import { deleteProduct } from "@/redux/features/productSlice";
import {
  ArrowLeft,
  Heart,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Package,
  Ruler,
  Weight,
  Calendar,
} from "lucide-react";
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
  const [quantity, setQuantity] = useState(1);
  const [visibleReviews, setVisibleReviews] = useState(10);

  // Scroll to top on mount and whenever the product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
    // Force scroll with a slight delay to ensure it happens after any other scroll events
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productInStore = productsInStore.find((p) => p.id === Number(id));
        if (productInStore) {
          setProduct(productInStore);
          setSelectedImage(productInStore.thumbnail);
          setLoading(false);
          return;
        }
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
      setVisibleReviews(10);
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
      toast.success(isFav ? "Removed from favorites" : "Added to favorites");
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

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) =>
      Math.max(1, Math.min(product?.stock || 1, prev + delta))
    );
  };

  const discountedPrice = product?.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  if (loading) {
    return (
      <main className="p-6">
        <SkeletonCard />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="p-6">
        <div className="text-center text-red-500">
          <p>{error || "Product not found"}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="px-8 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 mb-6 px-0 hover:bg-transparent cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 1. Product Gallery Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="relative aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden"
            >
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={selectedImage}
                  alt={product.title}
                  fill
                  className="object-contain p-8"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Thumbnail Previews */}
            {product.images && product.images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-4 gap-2"
              >
                {product.images.slice(0, 4).map((img, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square bg-gray-50 dark:bg-gray-900 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === img
                        ? "border-black dark:border-white"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* 2. Product Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.35 }}
              >
                <Badge variant="outline" className="mb-2">
                  {product.category}
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-3xl font-bold mb-2"
              >
                {product.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.45 }}
                className="text-sm text-muted-foreground mb-3"
              >
                Brand: {product.brand}
              </motion.p>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.55 + i * 0.05 }}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </motion.div>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="flex items-baseline gap-3 mb-4"
              >
                {discountedPrice ? (
                  <>
                    <span className="text-3xl font-bold">
                      ${discountedPrice}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.price}
                    </span>
                    <Badge variant="destructive">
                      {product.discountPercentage}% OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold">${product.price}</span>
                )}
              </motion.div>

              {/* Availability */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.65 }}
                className="flex items-center gap-2 mb-4"
              >
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0
                    ? `In Stock (${product.stock} units)`
                    : "Out of Stock"}
                </Badge>
                {product.availabilityStatus && (
                  <span className="text-sm text-muted-foreground">
                    {product.availabilityStatus}
                  </span>
                )}
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="text-muted-foreground leading-relaxed mb-4"
              >
                {product.description}
              </motion.p>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.75 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {product.tags.map((tag, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 + idx * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.85 }}
            >
              <Separator />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.95 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card>
                  <CardContent className="p-4 space-y-3">
                    {product.shippingInformation && (
                      <div className="flex items-start gap-3">
                        <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Shipping</p>
                          <p className="text-xs text-muted-foreground">
                            {product.shippingInformation}
                          </p>
                        </div>
                      </div>
                    )}
                    {product.warrantyInformation && (
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Warranty</p>
                          <p className="text-xs text-muted-foreground">
                            {product.warrantyInformation}
                          </p>
                        </div>
                      </div>
                    )}
                    {product.returnPolicy && (
                      <div className="flex items-start gap-3">
                        <RotateCcw className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Returns</p>
                          <p className="text-xs text-muted-foreground">
                            {product.returnPolicy}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 4. Product Details / Specifications Section - Full Width */}
      <div className="mb-12 bg-gray-50 dark:bg-gray-900/50 w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-7xl mx-auto px-8">
          <Card className="border-0 shadow-none bg-transparent">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger value="details" className="rounded-none">
                  Details
                </TabsTrigger>
                <TabsTrigger value="specifications" className="rounded-none">
                  Specifications
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none">
                  Reviews ({product.reviews?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Product Information</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">SKU:</dt>
                        <dd className="font-medium">{product.sku}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Barcode:</dt>
                        <dd className="font-medium">{product.barcode}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Brand:</dt>
                        <dd className="font-medium">{product.brand}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Category:</dt>
                        <dd className="font-medium capitalize">
                          {product.category}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Dimensions & Weight</h3>
                    <dl className="space-y-2 text-sm">
                      {product.dimensions && (
                        <>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground flex items-center gap-1">
                              <Ruler className="h-3 w-3" /> Width:
                            </dt>
                            <dd className="font-medium">
                              {product.dimensions.width} cm
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground flex items-center gap-1">
                              <Ruler className="h-3 w-3" /> Height:
                            </dt>
                            <dd className="font-medium">
                              {product.dimensions.height} cm
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground flex items-center gap-1">
                              <Package className="h-3 w-3" /> Depth:
                            </dt>
                            <dd className="font-medium">
                              {product.dimensions.depth} cm
                            </dd>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground flex items-center gap-1">
                          <Weight className="h-3 w-3" /> Weight:
                        </dt>
                        <dd className="font-medium">{product.weight} kg</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {product.meta && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-3">
                      Additional Information
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Created:
                        </dt>
                        <dd className="font-medium">
                          {new Date(
                            product.meta.createdAt
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Updated:
                        </dt>
                        <dd className="font-medium">
                          {new Date(
                            product.meta.updatedAt
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="specifications" className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-muted-foreground">{product.description}</p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2">Tags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-6">
                {/* 5. Reviews Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {product.rating.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.reviews?.length || 0} reviews
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {product.reviews && product.reviews.length > 0 ? (
                    <>
                      <div className="space-y-4">
                        {product.reviews
                          .slice(0, visibleReviews)
                          .map((review, idx) => (
                            <Card key={idx}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="font-semibold">
                                      {review.reviewerName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {review.reviewerEmail}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {review.comment}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString()}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                      </div>

                      {product.reviews.length > visibleReviews && (
                        <div className="flex justify-center mt-6">
                          <Button
                            variant="outline"
                            onClick={() =>
                              setVisibleReviews((prev) => prev + 10)
                            }
                          >
                            Load More Reviews (
                            {product.reviews.length - visibleReviews} remaining)
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* 6. Related Products */}
      <div className="pr-8 pb-12">
        {relatedProducts.length > 0 && (
          <section>
            <div className="mb-6 ml-2">
              <h2 className="text-2xl font-bold mb-1">Related Products</h2>
              <p className="text-sm text-muted-foreground">
                More products in {product.category}
              </p>
            </div>
            {loadingRelated ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid ml-8 lg:ml-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

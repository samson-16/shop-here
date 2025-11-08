"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { updateProductLocal } from "@/redux/features/productSlice";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/product";
import toast from "react-hot-toast";

interface FormState {
  title: string;
  description: string;
  price: string;
  stock: string;
  brand: string;
  category: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  price: "",
  stock: "",
  brand: "",
  category: "",
};

export default function EditProductPage() {
  const params = useParams<{ id: string | string[] }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!idParam) {
      setError("Missing product id in the URL.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get<Product>(
          `/products/${idParam}`
        );
        if (!isMounted) return;
        setOriginalProduct(data);
        setForm({
          title: data.title,
          description: data.description,
          price: String(data.price),
          stock: String(data.stock),
          brand: data.brand,
          category: data.category,
        });
        setError(null);
      } catch (fetchError: unknown) {
        if (!isMounted) return;
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load product details.";
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [idParam]);

  const handleBack = () => {
    router.back();
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!idParam || !originalProduct) return;

    setIsSubmitting(true);
    setError(null);
    setUpdatedProduct(null);

    try {
      const updatedData: Product = {
        ...originalProduct,
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        brand: form.brand.trim(),
        category: form.category.trim(),
      };

      // Try to update via API (will work for existing products)
      try {
        await axiosInstance.patch(`/products/${idParam}`, {
          title: updatedData.title,
          description: updatedData.description,
          price: updatedData.price,
          stock: updatedData.stock,
          brand: updatedData.brand,
          category: updatedData.category,
        });
      } catch (apiError) {
        // API update failed (e.g., product doesn't exist on server), but continue
        console.log("API update failed, updating locally only");
      }

      // Always update Redux store locally
      dispatch(updateProductLocal(updatedData));
      setUpdatedProduct(updatedData);
      toast.success("Product updated successfully!");
    } catch (submitError: unknown) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to update product. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <Button variant="outline" onClick={handleBack}>
          &larr; Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
              {error}
            </p>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="title">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Product title"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the product"
                  required
                  className="min-h-[120px] w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="price">
                    Price
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="stock">
                    Stock
                  </label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="brand">
                    Brand
                  </label>
                  <Input
                    id="brand"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="Brand name"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="category">
                    Category
                  </label>
                  <Input
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {updatedProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Product Updated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <p>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Title:
              </span>{" "}
              {updatedProduct.title}
            </p>
            <p>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Description:
              </span>{" "}
              {updatedProduct.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <p>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Price:
                </span>{" "}
                ${updatedProduct.price}
              </p>
              <p>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Stock:
                </span>{" "}
                {updatedProduct.stock}
              </p>
              <p>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Brand:
                </span>{" "}
                {updatedProduct.brand}
              </p>
              <p>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Category:
                </span>{" "}
                {updatedProduct.category}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

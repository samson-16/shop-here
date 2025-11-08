"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  price: "",
  stock: "",
  brand: "",
  category: "",
};

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setError(null);
    setCreatedProduct(null);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setCreatedProduct(null);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        brand: form.brand.trim(),
        category: form.category.trim(),
      };

      const { data } = await axiosInstance.post<Product>(
        "/products/add",
        payload
      );
      setCreatedProduct(data);
      setForm(INITIAL_FORM);
      toast.success(`Product "${data.title}" created successfully!`);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to create product. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Add a New Product</h1>
        <Button variant="outline" onClick={handleBack}>
          &larr; Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Title */}
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

            {/* Description */}
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
                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Price and Stock */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="price">
                  Price ($)
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

            {/* Brand and Category */}
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

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                Reset Form
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Success Message */}
      {createdProduct && (
        <Card>
          <CardHeader>
            <CardTitle>Product Created Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 text-sm">
              <div>
                <span className="font-semibold">Title:</span>{" "}
                {createdProduct.title}
              </div>
              <div>
                <span className="font-semibold">Description:</span>{" "}
                {createdProduct.description}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold">Price:</span> $
                  {createdProduct.price}
                </div>
                <div>
                  <span className="font-semibold">Stock:</span>{" "}
                  {createdProduct.stock}
                </div>
                <div>
                  <span className="font-semibold">Brand:</span>{" "}
                  {createdProduct.brand}
                </div>
                <div>
                  <span className="font-semibold">Category:</span>{" "}
                  {createdProduct.category}
                </div>
              </div>
            </div>
            <Button onClick={() => router.push("/")} className="w-full">
              View All Products
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

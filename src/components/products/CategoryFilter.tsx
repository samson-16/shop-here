"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/products/categories");

        // Ensure data is an array of strings
        const categoryList = Array.isArray(data)
          ? data.map((cat) =>
              typeof cat === "string"
                ? cat
                : cat.slug || cat.name || String(cat)
            )
          : [];

        setCategories(categoryList);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium whitespace-nowrap">
          Filter by Category:
        </label>
        <div className="h-11 w-full bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="category-filter"
        className="text-sm font-medium whitespace-nowrap"
      >
        Filter by Category:
      </label>
      <Select
        value={selectedCategory || "all"}
        onValueChange={(value) =>
          onCategoryChange(value === "all" ? "" : value)
        }
      >
        <SelectTrigger id="category-filter" className="w-full h-11">
          <SelectValue placeholder="All Products" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Products</SelectItem>
          {categories.map((category) => {
            const categoryStr = String(category);
            const displayName = categoryStr.replace(/-/g, " ");
            return (
              <SelectItem key={categoryStr} value={categoryStr}>
                <span className="capitalize">{displayName}</span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

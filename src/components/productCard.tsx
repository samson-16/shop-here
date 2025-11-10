"use client";

import Image from "next/image";
import { Heart, Pencil, Trash2, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/product";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (productId: number) => void;
  onDelete: (productId: number) => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onDelete,
}: ProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(product.id);
    setIsDeleting(false);
  };

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image Section */}
      <Link href={`/product/${product.id}`} className="block relative">
        <div className="relative h-24 sm:h-32 w-full bg-gray-50 dark:bg-gray-900 rounded-t-lg overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            priority={false}
            sizes="(min-width: 768px) 200px, 100vw"
            className="object-contain p-1.5 sm:p-2 transition duration-300 group-hover:scale-105"
          />
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(product.id);
          }}
          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/95 dark:bg-gray-800/95 shadow-sm transition hover:scale-110"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-3.5 w-3.5 ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
          />
        </button>
      </Link>

      {/* Content Section */}
      <div className="flex flex-col p-2 sm:p-2.5">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-1">
          <Link href={`/product/${product.id}`} className="flex-1 min-w-0">
            <h3 className="line-clamp-1 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {product.title}
            </h3>
          </Link>
          <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white whitespace-nowrap">
            ${product.price}
          </span>
        </div>

        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {product.category}
          </span>
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-1.5 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-6 sm:h-7 text-xs px-2 sm:px-3 shrink-0"
          >
            <Link
              href={`/edit/${product.id}`}
              className="inline-flex items-center gap-1"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-6 sm:h-7 px-2 sm:px-3 shrink-0"
                disabled={isDeleting}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{product.title}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}

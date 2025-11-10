"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, HeartOff, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative flex h-full flex-col overflow-hidden border-2 hover:border-primary/50 transition-colors mx-4">
        <CardHeader className="relative p-0">
          <Link href={`/product/${product.id}`} className="block">
            <div className="relative h-40 sm:aspect-square w-full bg-muted overflow-hidden">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                priority={false}
                sizes="(min-width: 768px) 240px, 100vw"
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          </Link>

          <motion.button
            type="button"
            onClick={() => onToggleFavorite(product.id)}
            className="absolute right-2 top-2 sm:right-3 sm:top-3 inline-flex h-6 w-6 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-background/80 text-primary shadow backdrop-blur-sm"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              initial={false}
              animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {isFavorite ? (
                <Heart className="h-3 w-3 sm:h-5 sm:w-5 fill-current text-red-500" />
              ) : (
                <HeartOff className="h-3 w-3 sm:h-5 sm:w-5" />
              )}
            </motion.div>
          </motion.button>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-1 sm:gap-2 p-2 sm:p-4">
          <div className="flex items-start justify-between gap-1.5 sm:gap-2">
            <h3 className="line-clamp-1 sm:line-clamp-2 text-sm sm:text-base font-semibold">
              <Link href={`/product/${product.id}`}>{product.title}</Link>
            </h3>
            <span className="min-w-max text-sm sm:text-lg font-semibold">
              ${product.price}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-2 sm:gap-3 px-2 pb-2 sm:px-4 sm:pb-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-0.5">
            <span className="font-medium capitalize text-xs sm:text-sm">
              {product.category}
            </span>
            <span className="text-xs">⭐ {product.rating.toFixed(1)}</span>
          </div>
          <div className="flex gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="min-w-max h-7 sm:h-9 px-2 sm:px-3 text-xs"
            >
              <Link
                href={`/edit/${product.id}`}
                className="inline-flex items-center gap-1"
              >
                <Pencil className="size-3 sm:size-4" /> Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="min-w-max h-7 sm:h-9 px-2 sm:px-3"
                  disabled={isDeleting}
                >
                  <Trash2 className="size-3 sm:size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{product.title}"? This
                    action cannot be undone.
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
        </CardFooter>
      </Card>
    </motion.div>
  );
}

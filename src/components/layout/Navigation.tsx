"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, LogOut, Menu, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleTheme } from "@/redux/features/themeSlice";
import { logout } from "@/redux/features/authSlice";

export default function Navigation() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useAppSelector((state) => state.theme.mode);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    router.push("/login");
  };

  const closeSheet = () => {
    setIsOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="border-b backdrop-blur-sm bg-background/95 sticky top-0 z-50"
    >
      <nav className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-block bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          >
            E-Shop
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline" size="sm">
              <Link href="/favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                My Favorites
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild size="sm">
              <Link href="/add" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </motion.div>

          {isAuthenticated ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
            </motion.div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-6">

                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                  onClick={closeSheet}
                >
                  <Link href="/favorites" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    My Favorites
                  </Link>
                </Button>

                <Button
                  asChild
                  className="w-full justify-start"
                  onClick={closeSheet}
                >
                  <Link href="/add" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Link>
                </Button>

                <div className="border-t pt-4 mt-2">
                  {isAuthenticated ? (
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start"
                      onClick={closeSheet}
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}

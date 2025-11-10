"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable Next.js automatic scroll restoration
    if (
      typeof window !== "undefined" &&
      "scrollRestoration" in window.history
    ) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // Force scroll to top on every route change
    window.scrollTo(0, 0);

    // Also try with a small delay to override any other scroll behavior
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}

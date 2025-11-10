import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/redux/providers";
import { Toaster } from "react-hot-toast";
import { Navigation, FloatingActionButton } from "@/components/layout";
import ScrollToTop from "@/components/ScrollToTop";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "E-commerce Shop",
  description: "A modern e-commerce shop built with Next.js and Redux.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          <ScrollToTop />
          <Navigation />
          <div className="container mx-auto">{children}</div>
          <FloatingActionButton />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "14px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#4ade80",
                  secondary: "#fff",
                },
                style: {
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
                style: {
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

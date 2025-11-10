"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { login } from "@/redux/features/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { FaUnlock } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock authentication - accept any username/password
    setTimeout(() => {
      if (form.username && form.password) {
        const user = {
          id: 1,
          username: form.username,
          email: `${form.username}@example.com`,
        };
        dispatch(login(user));
        toast.success(`Welcome back, ${form.username}!`);
        router.push("/");
      } else {
        toast.error("Please enter username and password");
      }
      setLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-gray-950 p-8 overflow-hidden fixed inset-0">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-6 z-20"
      >
        <Button
          variant="ghost"
          onClick={handleBack}
          className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl h-[600px] flex rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block w-1/2 p-6"
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src="/login.jpg"
              alt="Login Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-12"
        >
          <div className="w-full max-w-sm">
            {/* Brand Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-3 mb-12"
            >
              <FaUnlock className="h-8 w-8 text-black dark:text-white" />
              <h1 className="text-2xl font-bold text-black dark:text-white">
                eCommerce Shop
              </h1>
            </motion.div>

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
                Welcome back
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Sign in to continue shopping
              </p>
            </motion.div>

            {/* Login Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-black dark:text-white"
                >
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className="h-12 border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black dark:text-white"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="h-12 border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-semibold rounded-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                <span className="font-medium">Demo Mode:</span> Use any username
                and password
              </p>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

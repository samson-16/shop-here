## E-Shop

A modern e-commerce demo built with Next.js 16 and Redux Toolkit. The app showcases product browsing, searching, filtering, CRUD actions, and favorites management against the DummyJSON API.

## Features

- Product catalogue with infinite scroll pagination (10 items per fetch)
- Search and category filtering with debounced requests
- Product CRUD (create, edit, delete) and favorites list
- Auth mock flow with toast notifications and dark mode toggle
- Responsive layout with optimized images and subtle animations

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript + Tailwind CSS + shadcn/ui
- Redux Toolkit + React Redux
- Axios + DummyJSON API
- react-hot-toast, framer-motion, lucide-react

## Requirements

- Node.js 18.17 or newer (Node 20 recommended)
- npm 9+ (or pnpm/yarn/bun if preferred)

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and adjust values if needed:

   ```bash
   cp .env.example .env.local
   ```
`NEXT_PUBLIC_API_BASE_URL`.

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 to explore the app.

## Available Scripts

- `npm run dev` – Start the Next.js dev server with hot reload
- `npm run build` – Create an optimized production build
- `npm run start` – Serve the production build
- `npm run lint` – Run ESLint

## Project Structure

```
src/
  app/              # Next.js routes and layout
  components/       # Layout, product, and UI components
  hooks/            # Custom hooks (favorites, infinite scroll)
  redux/            # Redux store, slices, and providers
  lib/              # Axios instance and utilities
  types/            # Shared TypeScript types
```

## Testing & Verification

- Infinite scroll: ensure additional products load as you reach the end of the list
- CRUD actions: create, edit, and delete products to confirm API integration
- Favorites: add/remove items and verify persistence across views
- Responsive design: test header navigation, burger menu, and product layout on mobile widths

## Deployment

Run `npm run build` followed by `npm run start` in your hosting environment. The app expects `NEXT_PUBLIC_API_BASE_URL` to be available at runtime.

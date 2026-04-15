# WOW Gift Shop

## Overview

A futuristic, immersive e-commerce website for "WOW Gift (All Customized Gifts)" — a customized gift shop based in Nalgonda, India. Features a romantic premium dark theme with neon glow effects (pink, purple, gold), glassmorphism UI, and floating animations.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Express 5 (API Server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Features

- Hero landing page with animated floating gifts and neon heart
- Product shop with category filtering and search
- Product detail pages with customization options (text, photo upload, size)
- Shopping cart with client-side state management (React Context)
- Checkout with COD and UPI payment options
- Order confirmation with confetti animation
- Customization lab for designing gifts
- Admin dashboard with stats, order management, product CRUD
- Customer reviews system

## Database Schema

- **categories**: id, name, slug, icon, description
- **products**: id, name, description, price, originalPrice, imageUrl, images, categoryId, featured, customizable, rating, reviewCount, sizes, inStock, createdAt
- **orders**: id, customerName, customerPhone, customerAddress, pincode, paymentMethod, status, totalAmount, createdAt
- **order_items**: id, orderId, productId, productName, quantity, price, customText, customImageUrl, size
- **reviews**: id, productId, customerName, rating, comment, photoUrl, createdAt

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Routes

- `/` — Home page with hero, categories, featured products, reviews, trust section, contact info
- `/shop` — Product grid with filters
- `/product/:id` — Product detail with customization
- `/cart` — Shopping cart
- `/checkout` — Checkout form
- `/order-confirmation/:id` — Order success page
- `/customize` — Customization lab
- `/admin` — Admin dashboard

## Contact Info

- Store: Ravinder Nagar Colony, Nalgonda
- Phone: 08919848394

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

# ZimHub — Zimbabwe's Trusted Online Marketplace

A full-stack marketplace web application built for Zimbabwe, featuring buyer/seller/admin roles, product listings, Buy Now checkout, Make an Offer, seller verification, admin approval, ratings & reviews, order management, commission tracking, and placeholder Paynow/EcoCash payment integration.

Live at **[www.zimhub.co.zw](https://www.zimhub.co.zw)** — hosted on Railway with Cloudflare DNS.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL via Supabase
- **Storage:** Supabase Storage (product images)
- **ORM:** Prisma
- **Auth:** NextAuth.js (credentials provider, JWT sessions)
- **Hosting:** Railway (app) + Supabase (database) + Cloudflare (DNS/CDN)

## Quick Start (Local)

```bash
npm install
cp .env.example .env   # fill in Supabase or Docker Postgres URLs
npm run db:setup       # create tables + seed demo data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo Accounts (password: `password123`)

| Role   | Email                 |
|--------|-----------------------|
| Admin  | admin@zimhub.co.zw    |
| Seller | seller@zimhub.co.zw   |
| Buyer  | buyer@zimhub.co.zw    |

## Deploy to Production

See **[DEPLOY.md](./DEPLOY.md)** for the full step-by-step guide to deploy on **Railway + Supabase + Cloudflare** (custom domain `www.zimhub.co.zw`).

## Environment Variables

See [`.env.example`](./.env.example) for all required variables.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL pooled connection (Supabase port 6543) |
| `DIRECT_URL` | Yes | PostgreSQL direct connection (port 5432, for migrations) |
| `NEXTAUTH_URL` | Yes | Your app URL |
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT signing |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | For server-side image uploads |

## Features (MVP)

- Buyer & seller registration/login with role-based access
- Seller dashboard with image upload (Supabase Storage)
- Admin dashboard (product approval, seller verification)
- Buy Now checkout + Make an Offer
- Seller verification badges & buyer protection
- WhatsApp support button
- Placeholder Paynow/EcoCash payment providers
- Commission tracking per sale (5% default)

## License

Private — All rights reserved.

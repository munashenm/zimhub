# Deploy ZimHub to Railway + Supabase + Cloudflare

Step-by-step guide to get **ZimHub** live at **`https://www.zimhub.co.zw`**.

---

## Overview

| Service | Purpose | Cost (MVP) |
|---------|---------|------------|
| **Railway** | Hosts the Next.js app | ~$5/mo usage (Hobby) |
| **Supabase** | PostgreSQL database + image storage | Free tier |
| **Cloudflare** | DNS for `zimhub.co.zw` + CDN/SSL | Free |
| **GitHub** | Source code + auto-deploy | Free |

**Repository:** `https://github.com/munashenm/zimhub.git`
**Estimated time:** 30–45 minutes

---

## Part 1 — Supabase (Database + Images)

### Step 1: Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up / log in
2. Click **New project**
3. Choose:
   - **Name:** `zimhub`
   - **Database password:** save this somewhere safe
   - **Region:** `South Africa (Cape Town)` — closest to Zimbabwe
4. Wait ~2 minutes for the project to provision

### Step 2: Get database connection strings

1. In the Supabase dashboard → **Project Settings** → **Database**
2. Scroll to **Connection string** → select **URI**
3. Copy two URLs:

**Transaction pooler** (for the app — port 6543) → `DATABASE_URL`:
```
postgresql://postgres.[REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Direct connection** (for migrations — port 5432) → `DIRECT_URL`:
```
postgresql://postgres.[REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
```

> Replace `[PASSWORD]` with your database password. Keep `?pgbouncer=true` on the pooled URL.

### Step 3: Set up image storage

1. Go to **Storage** in the Supabase sidebar
2. Click **New bucket**
   - Name: `product-images`
   - **Public bucket:** ON
3. Add policies (SQL editor):

```sql
CREATE POLICY "Public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Service role upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');
```

> The app uploads via the service role key on the server, so no client-side auth is needed for uploads.

### Step 4: Get API keys

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret)

---

## Part 2 — Push code to GitHub

The repo is already configured for `https://github.com/munashenm/zimhub.git`:

```bash
git init
git add .
git commit -m "Initial ZimHub production-ready release"
git branch -M main
git remote add origin https://github.com/munashenm/zimhub.git
git push -u origin main
```

> `.env` is in `.gitignore` — never commit secrets.

---

## Part 3 — Deploy to Railway

### Step 5: Create the Railway project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select **`munashenm/zimhub`**
4. Railway detects Next.js (via Nixpacks) and reads `railway.json`:
   - **Build command:** `npm run build` (runs `prisma generate && next build`)
   - **Start command:** `npm run start`

### Step 6: Add environment variables

In Railway → your service → **Variables**, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Pooled URL (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | Direct URL (port 5432) |
| `NEXTAUTH_URL` | `https://www.zimhub.co.zw` |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `SUPABASE_STORAGE_BUCKET` | `product-images` |
| `PLATFORM_COMMISSION_RATE` | `0.05` |
| `WHATSAPP_SUPPORT_NUMBER` | `263771234567` |

> Do **not** set `PORT` — Railway injects it automatically and `next start` reads it.

### Step 7: Deploy & generate a public domain

1. Railway builds and deploys automatically on every push to `main`
2. Once deployed, go to **Settings** → **Networking** → **Generate Domain**
   to get a temporary URL like `https://zimhub-production.up.railway.app`
3. Verify the app loads on that URL before wiring the custom domain

### Step 8: Run database migrations

From your local machine, push the schema and seed demo data using the **direct** URL:

```bash
DATABASE_URL="<your-direct-url>" DIRECT_URL="<your-direct-url>" npx prisma db push
DATABASE_URL="<your-direct-url>" DIRECT_URL="<your-direct-url>" npm run db:seed
```

> Use the **direct** connection (port 5432) for `db push`, not the pooled one.

---

## Part 4 — Custom domain via Cloudflare (`www.zimhub.co.zw`)

### Step 9: Add the custom domain in Railway

1. In Railway → service → **Settings** → **Networking** → **Custom Domain**
2. Enter `www.zimhub.co.zw`
3. Railway shows a **CNAME target** like `xxxx.up.railway.app` — copy it

### Step 10: Configure DNS in Cloudflare

1. In Cloudflare, make sure `zimhub.co.zw` is added as a zone and the
   nameservers from Cloudflare are set at your `.co.zw` registrar
2. Go to **DNS** → **Records** → **Add record**:

| Type | Name | Target | Proxy status |
|------|------|--------|--------------|
| `CNAME` | `www` | `<the target Railway gave you>` | **DNS only (grey cloud)** first |

3. (Optional) Redirect the apex `zimhub.co.zw` → `www`:
   - Add a `CNAME` record: Name `@`, Target `<railway target>`, **DNS only**
   - Or use a Cloudflare **Redirect Rule**: `zimhub.co.zw/*` → `https://www.zimhub.co.zw/$1` (301)

> Start with **DNS only (grey cloud)** so Railway can issue the TLS certificate.
> After Railway shows the domain as **Active/Issued**, you may switch the
> record to **Proxied (orange cloud)** for Cloudflare CDN. If you proxy,
> set Cloudflare **SSL/TLS mode to Full (strict)** to avoid redirect loops.

### Step 11: Wait for verification

- Railway will verify the CNAME and provision SSL (a few minutes to ~1 hour for DNS propagation)
- Once Railway marks the domain **Active**, `https://www.zimhub.co.zw` is live

---

## Part 5 — Verify everything works

- [ ] `https://www.zimhub.co.zw` loads with products
- [ ] Login works (`buyer@zimhub.co.zw` / `password123`)
- [ ] Seller can upload product images
- [ ] Buy Now checkout flow completes
- [ ] Admin can approve products at `/admin`
- [ ] WhatsApp button opens correctly
- [ ] HTTPS padlock is active

---

## Local development with PostgreSQL

**Option A — Use your Supabase dev project** (easiest):
```env
DATABASE_URL="postgresql://...6543/...?pgbouncer=true"
DIRECT_URL="postgresql://...5432/..."
```

**Option B — Local Docker PostgreSQL:**
```bash
docker compose up -d
```
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/zimhub"
DIRECT_URL="postgresql://postgres:password@localhost:5432/zimhub"
```

Then run:
```bash
npm run db:setup
npm run dev
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Can't reach database` on Railway | Ensure `DATABASE_URL` uses port **6543** with `?pgbouncer=true` |
| Prisma `db push` fails | Use `DIRECT_URL` (port **5432**), not the pooled URL |
| Login redirects fail | `NEXTAUTH_URL` must exactly match `https://www.zimhub.co.zw` |
| Custom domain stuck "unverified" | Set the Cloudflare record to **DNS only (grey cloud)** until SSL is issued |
| Redirect loop after proxying | Set Cloudflare **SSL/TLS** to **Full (strict)** |
| Images not loading | Supabase bucket must be **public**; `next.config.ts` allows `**.supabase.co` |
| Image upload 503 | Set `SUPABASE_SERVICE_ROLE_KEY` in Railway variables |
| Build fails on Railway | Check deploy logs; `prisma generate` runs inside `npm run build` |

---

## Next steps after launch

1. Change demo account passwords
2. Connect Paynow / EcoCash (see `src/lib/payments.ts`)
3. Set up error monitoring (Sentry — free tier)
4. Add Google Analytics or Plausible
5. Register with ZIMRA if processing payments commercially

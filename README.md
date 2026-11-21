# BuzzBoard Client — AI-Powered Technical Publishing & Ad-Tech Platform

**BuzzBoard** is a modern, responsive technical publishing, editorial workflow, and direct sponsorship platform built with **React 19, TypeScript, Vite 6, Tailwind CSS v4, Redux Toolkit (RTK Query), and Framer Motion**.

- **Live Frontend**: `https://buzz-board-bd.vercel.app`
- **Live Backend API**: `https://buzzboard-backend.onrender.com`

---

## Key Features & Engineering Highlights

- **Modern Editorial Landing & Platform Modes (`/`)**:
  - Animated hero showcase (`HeroEditorialShowcase`) cycling through AI SEO, Bilingual Reader, and Live Sponsorships.
  - Interactive **Platform Modes** switcher (`PlatformModesSection`) for Reader Mode, Editorial Studio, Series Mode, and Creator Analytics.
  - Searchable, category-filtered publication feed with **Ad-Safe Verified** filtering, trending articles, and a dynamic **Featured Creator** sidebar card.
- **Authentication & Google OAuth 2.0 (`/login`, `/register`, `/auth/callback`)**:
  - Dedicated sign-in and registration pages with **Google OAuth 2.0** integration, JWT bearer token persistence, and return-to-origin redirects.
  - Protected routes (`Studio`, `Analytics`, `Reading List`, `Profile`) gracefully gate unauthenticated visitors without firing unauthorized `401` API requests.
- **Editorial Studio (`/studio`)**:
  - AI Writing Co-Pilot, automated SEO metadata & tag generation, pre-publish brand-safety moderation, and scheduled publishing.
- **Smart Reader Experience (`/posts/:id`)**:
  - 1-click AI TL;DR summaries, contextual Q&A against article content, bilingual translation (EN ↔ BN), reactions, bookmarks, and nested threaded comments.
- **Creator Profile & Account Management (`/profile`)**:
  - Avatar image upload (`FormData` + Cloudinary/local fallback), bio, portfolio & social links, password updates, and a portal-rendered shared confirmation modal (`ConfirmModal`) for sign-out.
- **Analytics & Direct Ad-Tech (`/analytics`)**:
  - Real-time creator telemetry (views, engagement rate, ad-safe readiness) and direct sponsored ad campaign creation (`in_article`, `sidebar`) with CTR tracking.
- **Performance & Code Splitting**:
  - Route-based `React.lazy` + `Suspense` splitting across secondary pages (`StudioPage`, `AnalyticsPage`, `ProfilePage`, `PostDetailPage`, etc.) to keep the initial bundle fast.
  - Fully responsive across Mobile (`320px+`), Tablet (`768px+`), Laptop (`1280×720`), Desktop, and Large Desktop screens.

---

## Tech Stack

- **Core**: React 19, TypeScript (`~5.7.2`), Vite 6
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), `clsx`, `tailwind-merge`
- **State & Networking**: Redux Toolkit + RTK Query (`@reduxjs/toolkit`, `react-redux`)
- **Routing & Motion**: React Router v7 (`react-router-dom`), Framer Motion (`framer-motion`), Lucide React
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`), Vercel (`vercel.json` SPA rewrites)

---

## Project Structure

```text
BuzzBoard-Client/
├── .github/workflows/ci.yml       # TypeScript check + Vite build CI
├── public/
├── src/
│   ├── app/                       # Redux store & typed hooks
│   ├── components/
│   │   ├── layout/                # Navbar, Footer, AdBannerSlot, PlatformModesSection
│   │   └── shared/                # HeroEditorialShowcase, SectionHeader, ConfirmModal, TiltCard3D, etc.
│   ├── features/
│   │   ├── api/                   # buzzboardApi.ts (RTK Query + resilient fallback)
│   │   └── auth/                  # authSlice.ts (JWT & user persistence)
│   ├── pages/                     # HomePage, AuthPage, OAuthCallbackPage, StudioPage,
│   │                              # SeriesPage, AnalyticsPage, BookmarksPage, ProfilePage, PostDetailPage
│   ├── types/                     # TypeScript domain interfaces
│   └── utils/                     # cn, formatDate, formatNumber, resolveMediaUrl, AllOptions
├── vercel.json                    # SPA rewrite rules for client-side routing
├── vite.config.ts                 # Vite config & dev proxy (/api, /uploads -> :5000)
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js `v18+` (recommended `v20+`)
- npm

### Local Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   `.env`:
   ```env
   # Dev uses Vite proxy (/api -> http://localhost:5000); set full URL in production
   VITE_API_URL=/api/v1
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000`.

### Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Vite dev server on port `3000` |
| `npm run build` | Run `tsc --noEmit` and build production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Routes

| Path | Page | Access |
| :--- | :--- | :--- |
| `/` | `HomePage` | Public |
| `/login` | `AuthPage` (Sign In) | Public |
| `/register` | `AuthPage` (Create Account + Google OAuth) | Public |
| `/auth/callback` | `OAuthCallbackPage` | Public |
| `/posts/:id` | `PostDetailPage` | Public (interactive actions require auth) |
| `/series` | `SeriesPage` | Public (creating series requires auth) |
| `/studio` | `StudioPage` | Auth-gated |
| `/analytics` | `AnalyticsPage` | Auth-gated |
| `/bookmarks` | `BookmarksPage` | Auth-gated |
| `/profile` | `ProfilePage` | Auth-gated |

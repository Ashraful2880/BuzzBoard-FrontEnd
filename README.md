# BuzzBoard Client

**BuzzBoard** is a modern technical publishing and editorial platform built with React 19, TypeScript, Vite, Tailwind CSS v4, and Redux Toolkit (RTK Query). It provides an editorial publishing studio, structured multi-part series, AI-assisted reading and writing tools, creator analytics, and direct sponsorship campaign management.

---

## Features

### Editorial & Publishing
- **Home Feed (`/`)**: Browse technical articles with search, category filtering, trending posts, a 3D hero carousel (`HeroCarousel3D`), interactive 3D tilt cards (`TiltCard3D`), and sponsorship ad slots (`AdBannerSlot`).
- **Post Reader (`/posts/:id`)**: Full article view with likes, emoji/post reactions, bookmarking, nested comments, AI-generated summaries, interactive Q&A on post content, and post translation.
- **Editorial Studio (`/studio`)**: Create and publish articles with series assignment, AI writing assistance, automated SEO metadata generation, and content moderation checks.
- **Structured Series (`/series`)**: Browse and create multi-part technical series.

### Creator Tools & Personalization
- **Analytics & Monetization (`/analytics`)**: View creator performance and monetization metrics, and create/manage direct ad campaigns.
- **Bookmarks (`/bookmarks`)**: Save and manage bookmarked articles.
- **Authentication & Notifications**: Modal-based login/registration (`AuthModal`) with JWT bearer token state (`authSlice`) and navbar notification support.
- **Resilient Offline Fallback**: `resilientBaseQuery` in `src/features/api/buzzboardApi.ts` automatically falls back to in-memory mock data (`mockFallbackData.ts`) when the backend API is offline or unreachable, allowing full UI exploration without a running server.

---

## Tech Stack

- **Framework**: React 19 + TypeScript (`~5.7.2`)
- **Build Tool**: Vite 6 (`@vitejs/plugin-react`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), `clsx`, `tailwind-merge`
- **State & Data Fetching**: Redux Toolkit & RTK Query (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router v7 (`react-router-dom`)
- **Animations & Icons**: Framer Motion (`framer-motion`), Lucide React (`lucide-react`)

---

## Project Structure

```text
BuzzBoard-Client/
├── public/
├── src/
│   ├── app/
│   │   ├── hooks.ts                # Typed Redux hooks
│   │   └── store.ts                # Redux store & RTK Query middleware
│   ├── components/
│   │   ├── layout/                 # Navbar, Footer, AuthModal, AdBannerSlot
│   │   └── shared/                 # Reusable UI (CustomButton, CustomInput, CustomSelect,
│   │                               # CustomDatePicker, HeroCarousel3D, TiltCard3D, SkeletonLoader, etc.)
│   ├── features/
│   │   ├── api/
│   │   │   ├── buzzboardApi.ts     # RTK Query endpoints & resilient fallback baseQuery
│   │   │   └── mockFallbackData.ts # In-memory fallback dataset
│   │   └── auth/
│   │       └── authSlice.ts        # Authentication state slice
│   ├── pages/
│   │   ├── HomePage.tsx            # Feed, trending, search & category filters
│   │   ├── PostDetailPage.tsx      # Article reader, comments, reactions, AI tools
│   │   ├── StudioPage.tsx          # Article composer & AI editorial tools
│   │   ├── SeriesPage.tsx          # Series directory & creation
│   │   ├── AnalyticsPage.tsx       # Creator analytics, monetization & ad campaigns
│   │   ├── BookmarksPage.tsx       # Saved articles
│   │   └── NotFoundPage.tsx        # 404 fallback page
│   ├── types/                      # TypeScript interfaces (posts, series, ads, auth, comments, etc.)
│   ├── utils/                      # Shared utilities & option constants
│   ├── App.tsx                     # Application routes & layout shell
│   ├── index.css                   # Global styles & Tailwind entry
│   └── main.tsx                    # React root mount
├── .env.example                    # Environment variable template
├── index.html                      # HTML entry & Google Fonts
├── package.json
├── tsconfig.json
└── vite.config.ts                  # Vite config, `@` alias, and `/api` + `/uploads` proxy
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (or compatible package manager)
- *(Optional)* BuzzBoard backend server running on `http://localhost:5000` for live persistence

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BuzzBoard-Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Copy `.env.example` to `.env` if you need to override the default API URL:
   ```bash
   cp .env.example .env
   ```
   `.env.example`:
   ```env
   # Optional: Override API base URL in production (defaults to /api/v1 via Vite proxy in dev)
   VITE_API_URL=/api/v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`. In development, Vite proxies `/api` and `/uploads` requests to `http://localhost:5000` (configured in `vite.config.ts`).

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on port `3000` |
| `npm run build` | Runs TypeScript type-checking (`tsc --noEmit`) and builds the production bundle |
| `npm run preview` | Locally previews the production build |

---

## Routes

| Path | Page | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Main feed, trending posts, search & category filters |
| `/posts/:id` | `PostDetailPage` | Article details, comments, reactions & AI reader tools |
| `/studio` | `StudioPage` | Editorial composer with AI writing, SEO & moderation tools |
| `/series` | `SeriesPage` | Browse and create multi-part series |
| `/analytics` | `AnalyticsPage` | Creator analytics, monetization & ad campaign management |
| `/bookmarks` | `BookmarksPage` | Bookmarked articles list |
| `*` | `NotFoundPage` | 404 Not Found page |

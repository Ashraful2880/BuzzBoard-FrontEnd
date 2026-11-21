import React, { Suspense, lazy } from "react";
import { HomePage } from "@/pages/HomePage";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SkeletonLoader } from "@/components/shared";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const AuthPage = lazy(() =>
  import("@/pages/AuthPage").then((m) => ({ default: m.AuthPage })),
);
const StudioPage = lazy(() =>
  import("@/pages/StudioPage").then((m) => ({ default: m.StudioPage })),
);
const SeriesPage = lazy(() =>
  import("@/pages/SeriesPage").then((m) => ({ default: m.SeriesPage })),
);
const ProfilePage = lazy(() =>
  import("@/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const AnalyticsPage = lazy(() =>
  import("@/pages/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })),
);
const BookmarksPage = lazy(() =>
  import("@/pages/BookmarksPage").then((m) => ({ default: m.BookmarksPage })),
);
const PostDetailPage = lazy(() =>
  import("@/pages/PostDetailPage").then((m) => ({ default: m.PostDetailPage })),
);
const OAuthCallbackPage = lazy(() =>
  import("@/pages/OAuthCallbackPage").then((m) => ({
    default: m.OAuthCallbackPage,
  })),
);

const RouteFallback: React.FC = () => (
  <div className="container px-4 sm:px-6 mx-auto pt-8">
    <SkeletonLoader variant="card" count={2} />
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F6F7F9] text-[#0F172A] relative">
        <Navbar />

        <main className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthPage initialMode="login" />} />
              <Route
                path="/register"
                element={<AuthPage initialMode="register" />}
              />
              <Route path="/auth/callback" element={<OAuthCallbackPage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/studio" element={<StudioPage />} />
              <Route path="/series" element={<SeriesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

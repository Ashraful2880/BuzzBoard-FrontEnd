import { HomePage } from "@/pages/HomePage";
import { AuthPage } from "@/pages/AuthPage";
import { StudioPage } from "@/pages/StudioPage";
import { SeriesPage } from "@/pages/SeriesPage";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { BookmarksPage } from "@/pages/BookmarksPage";
import { PostDetailPage } from "@/pages/PostDetailPage";
import { OAuthCallbackPage } from "@/pages/OAuthCallbackPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F6F7F9] text-[#0F172A] relative">
        <Navbar />

        <main className="flex-1">
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

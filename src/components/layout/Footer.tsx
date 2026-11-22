import {
  Rss,
  Mail,
  Globe,
  Github,
  Linkedin,
  FileCode2,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CustomButton, CustomInput } from "@/components/shared";
import { useSubscribeNewsletterMutation } from "@/features/api/buzzboardApi";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribedMsg, setSubscribedMsg] = useState("");
  const [subscribe, { isLoading }] = useSubscribeNewsletterMutation();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await subscribe({ email }).unwrap();
      setSubscribedMsg(
        res.message || "Subscribed to weekly engineering digest.",
      );
      setEmail("");
    } catch {
      setSubscribedMsg("Subscribed to BuzzBoard weekly digest.");
      setEmail("");
    }
  };

  return (
    <footer className="mt-4 sm:mt-6 border-t border-slate-200 bg-white">
      <div className="container px-2 lg:px-4 md:px-4 xl:px-4 sm:px-6 mx-auto py-4 sm:py-8 space-y-5">
        {/* Newsletter Strip */}
        <div className="rounded-md bg-[#FAF9F7] border border-slate-200 p-3 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
          <div className="max-w-xl space-y-1.5">
            <span className="inline-block text-[13px]  text-orange-700 font-semibold">
              Weekly Engineering Digest
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-950">
              Get Architecture &amp; Full-Stack Notes in Your Inbox
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Practical deep dives on React, Next.js, PostgreSQL, Prisma, and
              scalable SaaS systems. Zero spam.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            {subscribedMsg ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{subscribedMsg}</span>
              </div>
            ) : (
              <>
                <CustomInput
                  required
                  type="email"
                  value={email}
                  placeholder="Enter Your Email"
                  containerClassName="sm:w-72"
                  leftIcon={<Mail className="w-4 h-4" />}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <CustomButton
                  type="submit"
                  variant="emerald"
                  isLoading={isLoading}
                >
                  Subscribe
                </CustomButton>
              </>
            )}
          </form>
        </div>

        {/* 4-Column Professional Editorial Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-8 pb-5 border-b border-slate-200 pt-0.5 sm:pt-5">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-2 sm:space-y-4 text-center sm:text-start">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="BuzzBoard Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-display font-bold text-xl tracking-tight text-slate-950">
                Buzz<span className="text-orange-600">Board</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
              An editorial publishing platform built for software engineers,
              technical writers, and independent creators—combining structured
              series, bilingual reading, and transparent sponsorship analytics.
            </p>

            <div className="flex justify-center sm:justify-start items-center gap-2.5 pt-1">
              <a
                title="GitHub"
                target="_blank"
                rel="noreferrer"
                href="https://github.com/ashraful2880"
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:border-orange-300 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
                href="https://linkedin.com/in/islam-ashraful1"
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:border-orange-300 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                title="Portfolio"
                href="https://ashrafulislam.netlify.app"
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:border-orange-300 transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="lg:col-span-2 space-y-2 sm:space-y-3 text-center">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-900">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link
                  to="/"
                  className="hover:text-orange-600 transition-colors"
                >
                  Explore Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/series"
                  className="hover:text-orange-600 transition-colors"
                >
                  Learning Series
                </Link>
              </li>
              <li>
                <Link
                  to="/studio"
                  className="hover:text-orange-600 transition-colors"
                >
                  Editorial Studio
                </Link>
              </li>
              <li>
                <Link
                  to="/bookmarks"
                  className="hover:text-orange-600 transition-colors"
                >
                  Reading List
                </Link>
              </li>
            </ul>
          </div>

          {/* Monetization & SEO */}
          <div className="lg:col-span-2 space-y-2 sm:space-y-3 text-center sm:text-start">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-900">
              Growth &amp; Ads
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link
                  to="/analytics"
                  className="hover:text-orange-600 transition-colors"
                >
                  Analytics &amp; CTR
                </Link>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="/api/v1/seo/sitemap"
                  className="inline-flex items-center gap-1 hover:text-orange-600 transition-colors"
                >
                  <span>SEO Sitemap</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="/api/v1/seo/rss.xml"
                  className="inline-flex items-center gap-1 hover:text-orange-600 transition-colors"
                >
                  <Rss className="w-3.5 h-3.5" />
                  <span>RSS 2.0 Feed</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Developer & Stack */}
          <div className="lg:col-span-3 space-y-2 sm:space-y-3 text-center sm:text-start">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-900">
              Developers
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="/api/v1/docs"
                  className="inline-flex items-center gap-1.5 hover:text-orange-600 transition-colors"
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>REST API Reference</span>
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="/api/v1/health"
                  className="inline-flex items-center gap-1.5 hover:text-orange-600 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>API System Status</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-900">BuzzBoard</span>. All
            rights reserved.
          </p>
          <p>
            Engineered by{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://madmind.tech"
              className="font-semibold text-orange-600 hover:underline"
            >
              MadMind Technology
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

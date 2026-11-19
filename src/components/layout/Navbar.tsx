import {
  Bell,
  Edit3,
  Layers,
  LogOut,
  Compass,
  PenTool,
  Bookmark,
  BarChart3,
  CheckCheck,
  User as UserIcon,
} from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from "@/features/api/buzzboardApi";
import React, { useState, useRef, useEffect } from "react";
import { cn, formatDate } from "@/utils/cn";
import { CustomButton } from "@/components/shared";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "@/features/auth/authSlice";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { data: notifData } = useGetNotificationsQuery();
  const [markAllRead, { isLoading: isMarkingRead }] =
    useMarkAllNotificationsReadMutation();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const unreadCount = notifData?.unreadCount || 0;
  const notifications = notifData?.data || [];

  const navLinks = [
    { path: "/", label: "Explore", icon: <Compass className="w-4 h-4" /> },
    { path: "/series", label: "Series", icon: <Layers className="w-4 h-4" /> },
    {
      path: "/studio",
      label: "Editorial Studio",
      icon: <Edit3 className="w-4 h-4" />,
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      path: "/bookmarks",
      label: "Reading List",
      icon: <Bookmark className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F6F7F9]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-14 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              src="/logo.png"
              alt="BuzzBoard Logo"
              className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-slate-950 block leading-none">
                Buzz<span className="text-orange-600">Board</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-transparent p-1 rounded-lg">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors",
                    isActive
                      ? "text-slate-950"
                      : "text-slate-600 hover:text-slate-950",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 border-b-2 border-orange-400"
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Notifications */}
          <div className="flex items-center gap-2.5">
            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                title="Notifications"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg surface-3d-elevated p-4 z-50"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                      <div>
                        <h4 className="text-sm font-display font-bold text-slate-900">
                          Notifications
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Recent likes, reactions &amp; comments
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          disabled={isMarkingRead}
                          onClick={() => markAllRead()}
                          className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-semibold cursor-pointer disabled:opacity-50"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark read</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">
                          No notifications yet
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              setNotifOpen(false);
                              if (n.post?.slug)
                                navigate(`/posts/${n.post.slug}`);
                            }}
                            className={cn(
                              "p-3 rounded-lg border transition-colors cursor-pointer",
                              n.isRead
                                ? "bg-slate-50/70 border-slate-100 text-slate-600"
                                : "bg-orange-50/70 border-orange-200 text-slate-900",
                            )}
                          >
                            <p className="text-xs leading-relaxed">
                              {n.message}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                              {formatDate(n.createdAt)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <CustomButton
              size="sm"
              variant="primary"
              onClick={() => navigate("/studio")}
              leftIcon={<PenTool className="w-3.5 h-3.5" />}
            >
              Write Article
            </CustomButton>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-semibold text-slate-900 leading-none">
                    {user.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">
                    {user.role}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(logout())}
                  title="Sign out"
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <CustomButton
                size="sm"
                variant="secondary"
                leftIcon={<UserIcon className="w-3.5 h-3.5" />}
                onClick={() => navigate("/login")}
              >
                Sign In
              </CustomButton>
            )}
          </div>
        </div>

        {/* Mobile Bottom Quick Nav */}
        <div className="flex md:hidden items-center justify-around mt-2 rounded-xl surface-3d py-2 px-2">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium",
                  isActive ? "text-orange-600" : "text-slate-500",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

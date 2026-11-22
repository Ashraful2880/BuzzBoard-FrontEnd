import {
  Bell,
  Home,
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
import { logout } from "@/features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { cn, formatDate, resolveMediaUrl } from "@/utils/cn";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { CustomButton, ConfirmModal } from "@/components/shared";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const notifRef = useRef<HTMLDivElement>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [user?.profile_img?.url]);
  const { data: notifData } = useGetNotificationsQuery(undefined, {
    skip: !token,
  });

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

  const unreadCount = token ? notifData?.unreadCount || 0 : 0;
  const notifications = token ? notifData?.data || [] : [];

  const navLinks = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    {
      path: "/explore",
      label: "Explore",
      icon: <Compass className="w-4 h-4" />,
    },
    { path: "/series", label: "Series", icon: <Layers className="w-4 h-4" /> },
    {
      path: "/studio",
      label: "Write Article",
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
    <header className="sticky top-0 z-40 bg-[#F6F7F9]/80 backdrop-blur-md mb-2">
      <div className="container px-2 lg:px-4 md:px-4 xl:px-4 sm:px-6 mx-auto">
        <div className="h-14 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-1 sm:gap-2 group shrink-0"
          >
            <img
              src="/logo.png"
              alt="BuzzBoard Logo"
              className="w-6 sm:w-7 h-6 sm:h-7 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-slate-950 block leading-none">
                Buzz<span className="text-orange-600">Board</span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 border border-slate-200/70 p-1 rounded-full">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors",
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
                        stiffness: 420,
                        damping: 32,
                      }}
                      className="absolute inset-0 rounded-full bg-white border border-orange-200/80 shadow-2xs"
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 transition-colors",
                      isActive ? "text-orange-600" : "text-slate-400",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Notifications */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {user && token ? (
              <>
                {/* Notification Bell */}
                <div ref={notifRef} className="sm:relative">
                  <button
                    type="button"
                    title="Notifications"
                    onClick={() => setNotifOpen((prev) => !prev)}
                    className="relative w-8 h-8 rounded-full sm:border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
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
                        className="absolute left-3 right-3 top-14 sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96 rounded-xl surface-3d-elevated p-4 z-50 shadow-lg"
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

                        <div className="space-y-2 max-h-[65vh] sm:max-h-72 overflow-y-auto">
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
                  <span className="hidden sm:inline">Write Article</span>
                  <span className="sm:hidden">Write</span>
                </CustomButton>

                <div className="flex items-center gap-2 pl-2 sm:border-l border-slate-200">
                  <Link
                    to="/profile"
                    title="Open Profile"
                    className="flex items-center gap-1.5 sm:gap-2.5 sm:px-2 py-1 rounded-xl hover:bg-slate-100/80 transition-colors group"
                  >
                    {user.profile_img?.url && !avatarError ? (
                      <img
                        alt={user.name}
                        onError={() => setAvatarError(true)}
                        src={resolveMediaUrl(user.profile_img.url)}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-display font-bold text-xs flex items-center justify-center shrink-0">
                        {(user.name || "BB")
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((p) => p[0]?.toUpperCase())
                          .join("")}
                      </div>
                    )}
                    <span className="hidden lg:inline text-xs font-semibold text-slate-900 group-hover:text-orange-600 transition-colors leading-none">
                      {user.name}
                    </span>
                  </Link>

                  <button
                    type="button"
                    title="Sign out"
                    onClick={() => setLogoutModalOpen(true)}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <CustomButton
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate("/login")}
                  leftIcon={<UserIcon className="w-3.5 h-3.5" />}
                >
                  Sign In
                </CustomButton>
                <CustomButton
                  size="sm"
                  variant="primary"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </CustomButton>
              </>
            )}
          </div>
        </div>

        {/* Mobile & Tablet Quick Nav */}
        <div className="flex lg:hidden items-center justify-between sm:justify-around gap-1 overflow-x-auto sm:mt-2 rounded-xl surface-3d py-2 px-2">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                to={item.path}
                key={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-1 sm:px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium whitespace-nowrap shrink-0",
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

      <ConfirmModal
        variant="danger"
        confirmLabel="Sign Out"
        isOpen={logoutModalOpen}
        title="Sign out of BuzzBoard?"
        onClose={() => setLogoutModalOpen(false)}
        description="You will need to sign in again to access Editorial Studio, Analytics, and your Profile."
        onConfirm={() => {
          dispatch(logout());
          setLogoutModalOpen(false);
          navigate("/");
        }}
      />
    </header>
  );
};

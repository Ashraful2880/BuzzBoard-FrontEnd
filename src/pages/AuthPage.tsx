import {
  Eye,
  Mail,
  Lock,
  EyeOff,
  Layers,
  Sparkles,
  BarChart3,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  User as UserIcon,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/features/api/buzzboardApi";
import { AuthPageProps } from "@/types";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { setCredentials } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { CustomButton, CustomInput } from "@/components/shared";

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
    />
  </svg>
);

const HIGHLIGHTS = [
  {
    title: "AI Editorial Studio",
    icon: <Sparkles className="w-4 h-4 text-orange-600" />,
  },
  {
    title: "Structured Technical Series",
    icon: <Layers className="w-4 h-4 text-orange-600" />,
  },
  {
    title: "Reader Telemetry & Sponsorships",
    icon: <BarChart3 className="w-4 h-4 text-orange-600" />,
  },
];

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = "login",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [oauthNotice, setOauthNotice] = useState<string | null>(null);

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const redirectTo = (location.state as { from?: string } | null)?.from || "/";

  useEffect(() => {
    setMode(initialMode);
    const oauthErr = searchParams.get("oauth_error");
    setErrorMsg(oauthErr || "");
    setOauthNotice(null);
  }, [initialMode, searchParams]);

  const switchMode = (nextMode: "login" | "register") => {
    setMode(nextMode);
    setErrorMsg("");
    setOauthNotice(null);
    navigate(nextMode === "login" ? "/login" : "/register", {
      replace: true,
      state: location.state,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setOauthNotice(null);

    try {
      const response =
        mode === "login"
          ? await login({ email, password }).unwrap()
          : await register({ name, email, password }).unwrap();

      if (response.success && response.data) {
        dispatch(
          setCredentials({
            user: response.data,
            token: response.data.token || "",
          }),
        );
        navigate(redirectTo, { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(
        err?.data?.error ||
          (mode === "login"
            ? "Invalid email or password. Please try again."
            : "Could not create account. Please check your details."),
      );
    }
  };

  const handleGoogleAuth = () => {
    setErrorMsg("");
    setOauthNotice(null);
    const apiBase = (import.meta.env.VITE_API_URL || "/api/v1").replace(
      /\/+$/,
      "",
    );
    window.location.href = `${apiBase}/auth/google`;
  };

  if (user) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-2xl surface-3d-elevated p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-950">
            You&apos;re signed in as {user.name}
          </h1>
          <p className="text-sm text-slate-600">
            Your session is active. Jump back to exploring articles or open the
            Editorial Studio.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <CustomButton variant="primary" onClick={() => navigate("/")}>
              Explore Articles
            </CustomButton>
            <CustomButton
              variant="secondary"
              onClick={() => navigate("/studio")}
            >
              Open Studio
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-2 lg:px-4 md:px-4 xl:px-4 sm:px-6 mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:min-h-[62vh]">
        {/* Left Column: Editorial Brand Showcase */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="hidden lg:flex lg:col-span-6 h-full relative rounded-lg surface-3d-elevated px-10 py-6 flex-col justify-between overflow-hidden bg-architectural-grid"
        >
          <div className="pointer-events-none absolute -top-24 -left-16 w-72 h-72 rounded-full bg-gradient-to-tr from-orange-400/20 via-amber-300/20 to-rose-300/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-12 w-80 h-80 rounded-full bg-gradient-to-bl from-amber-300/20 via-orange-300/20 to-slate-200/20 blur-2xl" />

          <div className="relative z-10 space-y-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="BuzzBoard"
                className="w-8 h-8 object-contain"
              />
              <span className="font-display font-bold text-xl tracking-tight text-slate-950">
                Buzz<span className="text-orange-600">Board</span>
              </span>
            </Link>

            <div className="pt-2">
              <h1 className="text-2xl xl:text-3xl font-extrabold text-slate-950 ">
                Write, structure, and scale your{" "}
                <span className="text-orange-600">engineering notes</span>.
              </h1>
            </div>

            <div className="space-y-2 pt-4">
              {HIGHLIGHTS?.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3.5 p-2.5"
                >
                  <div className="w-9 h-9 rounded-full bg-orange-50 border border-orange-200/80 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold text-slate-900">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
            <span>Built for modern software builders</span>
            <Link
              to="/"
              className="inline-flex items-center gap-1 font-semibold text-slate-800 hover:text-orange-600 transition-colors"
            >
              Browse articles
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-6 flex"
        >
          <div className="relative w-full h-full rounded-2xl surface-3d-elevated p-6 sm:p-9 flex flex-col justify-between gap-1 overflow-hidden">
            {/* Subtle Ambient Shapes */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-bl from-orange-300/20 via-amber-200/15 to-transparent blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-amber-200/20 via-orange-200/10 to-transparent blur-2xl" />

            {/* Top Brand & Mode Header */}
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="BuzzBoard"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-display font-bold text-slate-950 leading-none">
                    Buzz<span className="text-orange-600">Board</span>{" "}
                    <span className="text-slate-400 font-normal">
                      Workspace
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {mode === "login"
                      ? "Sign in to continue writing & reading"
                      : "Create your free author account"}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-[11px] font-semibold text-orange-700 shrink-0">
                {mode === "login"
                  ? "Login Your Account"
                  : "Register Your Account"}
              </span>
            </div>

            {/* Center Form Content */}
            <div className="relative z-10 flex-1 flex flex-col just">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  exit={{ opacity: 0, y: -8 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={`space-y-2 ${mode === "login" ? "pt-8" : "pt-1"}`}
                >
                  {/* Top Google OAuth (Register mode only) */}
                  {mode === "register" && (
                    <div className="space-y-2 text-center">
                      <p className="text-xs font-medium text-slate-500">
                        Register with:
                      </p>
                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        className="inline-flex items-center justify-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 text-xs sm:text-[13px] font-medium text-slate-800 transition-all cursor-pointer"
                      >
                        <GoogleIcon className="w-4 h-4 shrink-0" />
                        <span>Continue with Google</span>
                      </button>

                      {oauthNotice && (
                        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                          <span>{oauthNotice}</span>
                        </div>
                      )}

                      {/* Divider */}
                      <div className="relative flex items-center">
                        <div className="flex-grow border-t border-slate-200" />
                        <span className="px-3 text-xs text-slate-400">Or</span>
                        <div className="flex-grow border-t border-slate-200" />
                      </div>
                    </div>
                  )}

                  {/* Email & Password Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "register" && (
                      <CustomInput
                        required
                        value={name}
                        label="Full Name"
                        placeholder="Enter Your Full Name"
                        onChange={(e) => setName(e.target.value)}
                        leftIcon={<UserIcon className="w-4 h-4" />}
                      />
                    )}

                    <CustomInput
                      required
                      type="email"
                      value={email}
                      label="Email"
                      placeholder="Enter Your Email"
                      leftIcon={<Mail className="w-4 h-4" />}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="space-y-1.5">
                      <div className="relative">
                        <CustomInput
                          required
                          label="Password"
                          value={password}
                          placeholder="Enter Password"
                          leftIcon={<Lock className="w-4 h-4" />}
                          type={showPassword ? "text" : "password"}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="absolute right-3 top-[34px] p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {mode === "register" && (
                        <p className="text-[11px] text-slate-500">
                          Minimum length is 6 characters.
                        </p>
                      )}
                    </div>

                    {errorMsg && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Action Row: Mode Switch + Compact Submit Button */}
                    <div
                      className={`flex flex-wrap items-center justify-between gap-3 ${mode === "login" ? "pt-6" : "pt-0"}`}
                    >
                      <p className="text-xs text-slate-500">
                        {mode === "login" ? (
                          <>
                            New to BuzzBoard?{" "}
                            <button
                              type="button"
                              onClick={() => switchMode("register")}
                              className="font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
                            >
                              Create a free account
                            </button>
                          </>
                        ) : (
                          <>
                            Already have an account?{" "}
                            <button
                              type="button"
                              onClick={() => switchMode("login")}
                              className="font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
                            >
                              Login Here
                            </button>
                          </>
                        )}
                      </p>

                      <CustomButton
                        size="md"
                        type="submit"
                        variant="primary"
                        className="px-6"
                        isLoading={isLoggingIn || isRegistering}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        {mode === "login" ? "Login" : "Registration"}
                      </CustomButton>
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Editorial Strip */}
            {mode === "login" && (
              <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Instant access to Studio, Series &amp; Reading List</span>
                <span className="font-mono text-slate-500">BuzzBoard v1.0</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

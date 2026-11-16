import {
  useLoginMutation,
  useRegisterMutation,
} from "@/features/api/buzzboardApi";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon } from "lucide-react";
import { CustomButton, CustomInput } from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setAuthModalOpen, setCredentials } from "@/features/auth/authSlice";

export const AuthModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthModalOpen } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

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
        dispatch(setAuthModalOpen(false));
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.error || "Invalid email or password.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-md rounded-xl surface-3d-elevated p-6 sm:p-8"
        >
          <button
            type="button"
            onClick={() => dispatch(setAuthModalOpen(false))}
            className="absolute right-5 top-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/logo.png"
                alt="BuzzBoard"
                className="w-7 h-7 object-contain"
              />
              <span className="font-display font-bold text-base text-slate-950">
                Buzz<span className="text-orange-600">Board</span>
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-950">
              {mode === "login"
                ? "Sign in to your account"
                : "Create your account"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {mode === "login"
                ? "Enter your credentials to publish articles and view analytics."
                : "Join BuzzBoard to publish technical articles and build series."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <CustomInput
                required
                value={name}
                label="Full Name"
                placeholder="Md Ashraful Islam"
                onChange={(e) => setName(e.target.value)}
                leftIcon={<UserIcon className="w-4 h-4" />}
              />
            )}

            <CustomInput
              required
              type="email"
              value={email}
              label="Email Address"
              placeholder="you@company.com"
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <CustomInput
              required
              type="password"
              label="Password"
              value={password}
              error={errorMsg}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              onChange={(e) => setPassword(e.target.value)}
            />

            <CustomButton
              fullWidth
              type="submit"
              variant="primary"
              isLoading={isLoggingIn || isRegistering}
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </CustomButton>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-200 text-center">
            <button
              type="button"
              onClick={() => {
                setErrorMsg("");
                setMode(mode === "login" ? "register" : "login");
              }}
              className="text-xs text-slate-600 hover:text-blue-600 font-medium cursor-pointer"
            >
              {mode === "login"
                ? "Don't have an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

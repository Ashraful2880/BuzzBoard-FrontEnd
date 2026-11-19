import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/features/auth/authSlice";

export const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const oauthError = searchParams.get("oauth_error");

    if (oauthError) {
      navigate(`/login?oauth_error=${encodeURIComponent(oauthError)}`, {
        replace: true,
      });
      return;
    }

    if (!token) {
      navigate(
        `/login?oauth_error=${encodeURIComponent(
          "Authentication token missing from callback.",
        )}`,
        { replace: true },
      );
      return;
    }

    const completeLogin = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "/api/v1";
        const res = await fetch(`${apiBase}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await res.json();

        if (!res.ok || !payload?.success || !payload?.data) {
          throw new Error(
            payload?.error || "Failed to load user profile after OAuth.",
          );
        }

        dispatch(
          setCredentials({
            user: { ...payload.data, token },
            token,
          }),
        );
        navigate("/", { replace: true });
      } catch (err: any) {
        navigate(
          `/login?oauth_error=${encodeURIComponent(
            err?.message || "OAuth sign-in failed. Please try again.",
          )}`,
          { replace: true },
        );
      }
    };

    completeLogin();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="rounded-2xl surface-3d-elevated p-8 space-y-4">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto" />
        <h1 className="text-xl font-display font-bold text-slate-950">
          Completing sign-in...
        </h1>
        <p className="text-xs text-slate-500">
          Verifying your account and loading your BuzzBoard workspace.
        </p>
      </div>
    </div>
  );
};

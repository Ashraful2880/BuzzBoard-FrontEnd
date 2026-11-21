import {
  Mail,
  Save,
  Lock,
  Globe,
  LogOut,
  Camera,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  User as UserIcon,
} from "lucide-react";
import {
  EmptyState,
  TiltCard3D,
  CustomInput,
  CustomButton,
  ConfirmModal,
  SectionHeader,
  CustomTextarea,
  SkeletonLoader,
} from "@/components/shared";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/features/api/buzzboardApi";
import { resolveMediaUrl } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout, setCredentials } from "@/features/auth/authSlice";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, token } = useAppSelector((state) => state.auth);

  const { data: profileRes, isLoading } = useGetProfileQuery(undefined, {
    skip: !token,
  });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const activeUser = profileRes?.data || user;

  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (activeUser) {
      setBio(activeUser.bio || "");
      setName(activeUser.name || "");
      setEmail(activeUser.email || "");
      setWebsite(activeUser.website || "");
      setGithub(activeUser.socialLinks?.github || "");
      setTwitter(activeUser.socialLinks?.twitter || "");
      setLinkedin(activeUser.socialLinks?.linkedin || "");
      setAvatarError(false);
    }
  }, [activeUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setErrorMsg("");
    setSelectedFile(file);
    setAvatarError(false);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (newPassword && newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("bio", bio);
      formData.append("website", website.trim());
      formData.append(
        "socialLinks",
        JSON.stringify({
          github: github.trim(),
          linkedin: linkedin.trim(),
          twitter: twitter.trim(),
        }),
      );
      if (newPassword) {
        formData.append("password", newPassword);
      }
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await updateProfile(formData).unwrap();
      if (res.success && res.data) {
        dispatch(
          setCredentials({
            user: res.data,
            token: res.data.token || token || "",
          }),
        );
        setNewPassword("");
        setSelectedFile(null);
        if (res.data.profile_img?.url) {
          if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
          }
          setPreviewUrl("");
        }
        setSuccessMsg("Your profile has been updated successfully.");
      }
    } catch (err: any) {
      setErrorMsg(
        err?.data?.error || "Failed to update profile. Please try again.",
      );
    }
  };

  if (!user || !token) {
    return (
      <div className="container px-2 lg:px-4 md:px-4 xl:px-4 sm:px-6 mx-auto space-y-8">
        <SectionHeader
          badge="Account"
          title="Creator"
          highlight="Profile"
          badgeIcon={<UserIcon className="w-3 h-3" />}
          description="Manage your public author identity, avatar, bio, and social links."
        />

        <div className="max-w-3xl mx-auto">
          <EmptyState
            actionLabel="Sign In"
            secondaryLabel="Create Account"
            title="Sign In to Manage Your Profile"
            icon={<UserIcon className="w-6 h-6" />}
            onAction={() => navigate("/login", { state: { from: "/profile" } })}
            description="Sign in with your BuzzBoard account to update your profile, avatar, and social links."
            onSecondaryAction={() =>
              navigate("/register", { state: { from: "/profile" } })
            }
          />
        </div>
      </div>
    );
  }

  const displayAvatar =
    previewUrl || resolveMediaUrl(activeUser?.profile_img?.url);
  const initials = (activeUser?.name || "BB")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="container px-2 lg:px-4 md:px-4 xl:px-4 sm:px-6 mx-auto space-y-3">
      <SectionHeader
        badge="Account"
        title="Creator"
        highlight="Profile"
        badgeIcon={<UserIcon className="w-3 h-3" />}
        description="Manage your public author identity, avatar, bio, and social links."
      />

      {isLoading && !activeUser ? (
        <SkeletonLoader variant="card" count={2} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Avatar & Account Overview */}
          <div className="lg:col-span-4 space-y-5">
            <TiltCard3D intensity={4} className="p-6 space-y-5">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative group">
                  {displayAvatar && !avatarError ? (
                    <img
                      src={displayAvatar}
                      alt={activeUser?.name || "Profile"}
                      onError={() => setAvatarError(true)}
                      className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 text-white font-display font-bold text-2xl flex items-center justify-center shadow-xs">
                      {initials || "BB"}
                    </div>
                  )}

                  <button
                    type="button"
                    title="Upload profile photo"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-md border-2 border-white transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-display font-bold text-slate-950">
                    {activeUser?.name}
                  </h2>
                  <p className="text-xs text-slate-500">{activeUser?.email}</p>
                  <div className="pt-1 flex items-center justify-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[11px] font-mono uppercase font-semibold text-orange-700">
                      {activeUser?.role || "user"}
                    </span>
                    {activeUser?.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
                <div>
                  <p className="text-sm font-display font-bold text-slate-950">
                    {activeUser?.followersCount ?? 0}
                  </p>
                  <p className="text-[11px] text-slate-500">Followers</p>
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-slate-950">
                    {activeUser?.followingCount ?? 0}
                  </p>
                  <p className="text-[11px] text-slate-500">Following</p>
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-slate-950">
                    {(activeUser as any)?.bookmarksCount ?? 0}
                  </p>
                  <p className="text-[11px] text-slate-500">Saved</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-center">
                <CustomButton
                  size="md"
                  variant="outline"
                  className="px-6"
                  onClick={() => setLogoutModalOpen(true)}
                  leftIcon={<LogOut className="w-4 h-4 text-rose-600" />}
                >
                  Sign Out
                </CustomButton>
              </div>
            </TiltCard3D>
          </div>

          {/* Right Column: Edit Form */}
          <div className="lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl surface-3d-elevated p-5 sm:px-5 sm:py-4 space-y-3"
            >
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-display font-bold text-slate-950">
                    Profile Details
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your display name, bio, avatar, and public links.
                  </p>
                </div>
                {selectedFile && (
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700">
                    Photo ready: {selectedFile.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInput
                  required
                  value={name}
                  label="Full Name"
                  placeholder="Md Ashraful Islam"
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<UserIcon className="w-4 h-4" />}
                />

                <CustomInput
                  required
                  type="email"
                  value={email}
                  label="Email Address"
                  placeholder="you@company.com"
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                />
              </div>

              <CustomTextarea
                rows={3}
                value={bio}
                label="Author Bio"
                placeholder="Write a short bio about your engineering focus and background..."
                onChange={(e) => setBio(e.target.value)}
              />

              <CustomInput
                type="url"
                value={website}
                label="Website / Portfolio URL"
                placeholder="https://yourportfolio.com"
                onChange={(e) => setWebsite(e.target.value)}
                leftIcon={<Globe className="w-4 h-4" />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CustomInput
                  value={github}
                  label="GitHub URL"
                  placeholder="https://github.com/username"
                  onChange={(e) => setGithub(e.target.value)}
                />
                <CustomInput
                  value={linkedin}
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/username"
                  onChange={(e) => setLinkedin(e.target.value)}
                />
                <CustomInput
                  value={twitter}
                  label="X / Twitter URL"
                  placeholder="https://x.com/username"
                  onChange={(e) => setTwitter(e.target.value)}
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <CustomInput
                  type="password"
                  value={newPassword}
                  label="New Password (Optional)"
                  placeholder="Leave blank to keep current password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <CustomButton
                  type="submit"
                  variant="primary"
                  isLoading={isUpdating}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Changes
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
};

import React from "react";
import { useNavigate } from "react-router-dom";
import { Compass, ArrowLeft, Edit3 } from "lucide-react";
import { CustomButton, TiltCard3D } from "@/components/shared";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <TiltCard3D
        intensity={4}
        elevated
        className="p-10 sm:p-14 text-center space-y-6 bg-architectural-grid"
      >
        <div className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600">
          404 • Page Not Found
        </div>

        <h1 className="text-5xl sm:text-7xl font-display font-bold text-slate-900">
          404
        </h1>

        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            This Page Doesn&apos;t Exist
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            The article, series, or route you are looking for may have been
            moved or removed.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <CustomButton
            variant="primary"
            onClick={() => navigate("/")}
            leftIcon={<Compass className="w-4 h-4" />}
          >
            Back to Explore
          </CustomButton>
          <CustomButton
            variant="secondary"
            onClick={() => navigate("/studio")}
            leftIcon={<Edit3 className="w-4 h-4" />}
          >
            Editorial Studio
          </CustomButton>
          <CustomButton
            variant="ghost"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </CustomButton>
        </div>
      </TiltCard3D>
    </div>
  );
};

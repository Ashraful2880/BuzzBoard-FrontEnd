import {
  TiltCard3D,
  EmptyState,
  CustomInput,
  CustomSelect,
  CustomButton,
  SkeletonLoader,
  CustomTextarea,
} from "@/components/shared";
import {
  useGetSeriesListQuery,
  useCreateSeriesMutation,
} from "@/features/api/buzzboardApi";
import React, { useState } from "react";
import { formatDate } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import { setAuthModalOpen } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Layers, Plus, ArrowRight, BookOpen } from "lucide-react";

export const SeriesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const { data: seriesRes, isLoading } = useGetSeriesListQuery();
  const [createSeries, { isLoading: isCreating }] = useCreateSeriesMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technology");

  const seriesList = seriesRes?.data || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      dispatch(setAuthModalOpen(true));
      return;
    }
    if (!title.trim()) return;
    await createSeries({ title, description, category }).unwrap();
    setTitle("");
    setDescription("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-950 flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-orange-600" />
          <span>Engineering Series &amp; Guides</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {isLoading ? (
            <SkeletonLoader variant="card" count={2} />
          ) : seriesList.length === 0 ? (
            <EmptyState
              title="No Series Published Yet"
              icon={<Layers className="w-6 h-6" />}
              description="Create your first multi-part series using the form on the right to organize related articles."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seriesList.map((s) => (
                <TiltCard3D
                  key={s._id}
                  intensity={5}
                  onClick={() => navigate("/")}
                  className="p-6 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-[11px] font-mono text-orange-700 font-semibold">
                        {s.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono uppercase font-semibold">
                        {s.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-display font-bold text-slate-950 leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      Created {formatDate(s.createdAt)}
                    </span>
                    <span className="text-orange-600 flex items-center gap-1 font-semibold">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </TiltCard3D>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={handleCreate}
          className="lg:col-span-4 rounded-xl surface-3d-elevated p-6 space-y-4 h-fit"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-display font-bold text-slate-950">
              Create a New Series
            </h3>
          </div>

          <CustomInput
            required
            value={title}
            label="Series Title"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
          />

          <CustomSelect
            label="Category"
            value={category}
            onChange={setCategory}
            options={[
              { value: "Technology", label: "Technology" },
              { value: "Business", label: "Business" },
              { value: "Education", label: "Education" },
            ]}
          />

          <CustomTextarea
            rows={3}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will readers learn across this series?"
          />

          <CustomButton
            fullWidth
            type="submit"
            variant="primary"
            isLoading={isCreating}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Series
          </CustomButton>
        </form>
      </div>
    </div>
  );
};

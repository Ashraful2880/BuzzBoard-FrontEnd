import {
  TiltCard3D,
  EmptyState,
  CustomInput,
  CustomSelect,
  CustomButton,
  SectionHeader,
  SkeletonLoader,
  CustomTextarea,
} from "@/components/shared";
import {
  useGetSeriesListQuery,
  useCreateSeriesMutation,
} from "@/features/api/buzzboardApi";
import React, { useState } from "react";
import { formatDate } from "@/utils/cn";
import { useAppSelector } from "@/app/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { Layers, Plus, ArrowRight, BookOpen } from "lucide-react";

export const SeriesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!title.trim()) return;
    await createSeries({ title, description, category }).unwrap();
    setTitle("");
    setDescription("");
  };

  return (
    <div className="container px-2 lg:px-4 md:px-4 xl:px-4 sm:px-6 mx-auto sm:space-y-5 space-y-3">
      <SectionHeader
        badge="Curriculum"
        title="Engineering"
        highlight="Series & Guides"
        badgeIcon={<Layers className="w-3 h-3" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              {seriesList.map((s) => (
                <TiltCard3D
                  key={s._id}
                  intensity={5}
                  onClick={() => navigate(`/series/${s.slug || s._id}`)}
                  className="p-3 sm:p-6 flex flex-col justify-between gap-3 sm:gap-4"
                >
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-[11px] text-orange-700 font-semibold">
                        {s.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] uppercase font-semibold">
                        {s.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-display font-bold text-slate-950">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-3 sm:pt-4 flex items-center justify-between text-xs text-slate-500">
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
          className="lg:col-span-4 rounded-lg sm:rounded-xl surface-3d-elevated p-3 sm:p-6 space-y-4 h-fit"
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
            placeholder="Enter Title..."
            onChange={(e) => setTitle(e.target.value)}
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
            placeholder="What Will Readers Learn Across This Series?"
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

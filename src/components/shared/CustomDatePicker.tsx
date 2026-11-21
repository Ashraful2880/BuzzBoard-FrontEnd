import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import type { CustomDatePickerProps } from "@/types/sharedTypes";
import { Calendar, ChevronLeft, ChevronRight, Clock, X } from "lucide-react";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Schedule date & time (Optional)",
  helperText,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [selectedHour, setSelectedHour] = useState(
    value ? new Date(value).getHours() : 10,
  );
  const [selectedMinute, setSelectedMinute] = useState(
    value ? new Date(value).getMinutes() : 0,
  );

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const handleSelectDay = (day: number) => {
    const chosen = new Date(
      viewYear,
      viewMonth,
      day,
      selectedHour,
      selectedMinute,
    );
    onChange(chosen.toISOString());
    setIsOpen(false);
  };

  const applyQuickPreset = (daysOffset: number, hour = 9) => {
    const target = new Date();
    target.setDate(target.getDate() + daysOffset);
    target.setHours(hour, 0, 0, 0);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setSelectedHour(hour);
    setSelectedMinute(0);
    onChange(target.toISOString());
    setIsOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const formattedDisplay = value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "";

  const selectedDateObj = value ? new Date(value) : null;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full space-y-1.5", className)}
    >
      {label && (
        <label className="block text-xs font-semibold text-slate-600">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "w-full h-10 px-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2 text-sm text-left transition-all duration-150 cursor-pointer hover:border-slate-300",
            isOpen && "border-orange-500 ring-2 ring-orange-500/15",
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <span
              className={cn(
                "truncate",
                formattedDisplay
                  ? "text-slate-900 font-medium"
                  : "text-slate-400",
              )}
            >
              {formattedDisplay || placeholder}
            </span>
          </div>
        </button>

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            title="Clear date"
            className="absolute right-2.5 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute z-50 left-0 mt-1.5 w-80 max-w-[calc(100vw-2rem)] rounded-lg surface-3d-elevated p-4"
          >
            <div className="flex items-center gap-1.5 mb-3 pb-2.5 border-b border-slate-100">
              <button
                type="button"
                onClick={() => applyQuickPreset(1, 9)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
              >
                Tomorrow 9AM
              </button>
              <button
                type="button"
                onClick={() => applyQuickPreset(3, 14)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
              >
                +3 Days
              </button>
              <button
                type="button"
                onClick={() => applyQuickPreset(7, 10)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
              >
                Next Week
              </button>
            </div>

            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-display font-semibold text-slate-900">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1 text-center">
              {DAY_HEADERS.map((d) => (
                <span
                  key={d}
                  className="text-[11px] font-mono text-slate-400 py-1"
                >
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const isSelected =
                  selectedDateObj &&
                  selectedDateObj.getFullYear() === viewYear &&
                  selectedDateObj.getMonth() === viewMonth &&
                  selectedDateObj.getDate() === dayNum;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleSelectDay(dayNum)}
                    className={cn(
                      "h-8 rounded-lg text-xs font-mono flex items-center justify-center transition-colors cursor-pointer",
                      isSelected
                        ? "bg-slate-900 text-white font-bold shadow-sm"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                    )}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                <span>Publish Time:</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={String(selectedHour).padStart(2, "0")}
                  onChange={(e) =>
                    setSelectedHour(
                      Math.min(
                        23,
                        Math.max(0, parseInt(e.target.value, 10) || 0),
                      ),
                    )
                  }
                  className="w-12 h-7 text-center rounded-md bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900"
                />
                <span className="text-slate-400 font-mono">:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  step={5}
                  value={String(selectedMinute).padStart(2, "0")}
                  onChange={(e) =>
                    setSelectedMinute(
                      Math.min(
                        59,
                        Math.max(0, parseInt(e.target.value, 10) || 0),
                      ),
                    )
                  }
                  className="w-12 h-7 text-center rounded-md bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

import {
  motion,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { cn } from "@/utils/cn";
import React, { useRef } from "react";
import type { TiltCard3DProps } from "@/types/sharedTypes";

export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  onClick,
  children,
  className,
  intensity = 10,
  elevated = false,
  glareColor = "rgba(249, 115, 22, 0.08)",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const springConfig = { damping: 20, stiffness: 280, mass: 0.55 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const pctX = (clientX / width) * 100;
    const pctY = (clientY / height) * 100;

    const rX = ((clientY / height - 0.5) * -intensity * 2).toFixed(2);
    const rY = ((clientX / width - 0.5) * intensity * 2).toFixed(2);

    rotateX.set(Number(rX));
    rotateY.set(Number(rY));
    mouseX.set(pctX);
    mouseY.set(pctY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(50);
    mouseY.set(50);
  };

  const glareBackground = useMotionTemplate`radial-gradient(420px circle at ${mouseX}% ${mouseY}%, ${glareColor}, transparent 75%)`;

  return (
    <div className="perspective-1000 h-full">
      <motion.div
        ref={ref}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          y: -4,
          scale: 1.012,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className={cn(
          "relative rounded-lg transition-colors duration-200 overflow-hidden group",
          elevated ? "surface-3d-elevated" : "surface-3d",
          onClick && "cursor-pointer hover:border-orange-300/80",
          className,
        )}
      >
        {/* Dynamic 3D Specular Spotlight */}
        <motion.div
          style={{ background: glareBackground }}
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"
        />

        {/* Crisp Top Rim Highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div
          className="relative z-10 h-full"
          style={{ transform: "translateZ(24px)" }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};

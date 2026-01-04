import { cn } from "@/lib/utils";

interface ShadowGlowProps {
  color: string;
  isHovering: boolean;
  status: string;
}

export function ShadowGlow({ color, isHovering, status }: ShadowGlowProps) {
  return (
    <div
      className={cn(
        `absolute inset-0 rounded-2xl transition-all duration-500 bg-linear-to-r ${color}`,
        status === "processing" && "opacity-90 blur-md scale-110 animate-pulse",
        status === "error" && "opacity-50 blur-md",
        isHovering && status === "idle"
          ? "opacity-90 blur-md scale-105"
          : "opacity-0"
      )}
    />
  );
}

import { IGlowCircle } from "@/features/itinerary/components/ann-button/types";

interface GlowCircleProps {
  circle: IGlowCircle;
  index: number;
}

export function GlowCircle({ circle, index }: GlowCircleProps) {
  return (
    <div
      className="absolute rounded-full bg-purple-500 animate-ping transition-opacity duration-500"
      style={{
        left: `${circle.x}%`,
        top: `${circle.y}%`,
        width: "12px",
        height: "12px",
        animationDelay: `${circle.delay}s`,
        animationDuration: `${circle.duration}s`,
        opacity: 0.4,
        transitionDelay: `${index * 100}ms`,
      }}
    />
  );
}

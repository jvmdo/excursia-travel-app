import { IPosition } from "@/features/itinerary/components/ann-button/types";

interface BrainNodeProps {
  position: IPosition;
  index: number;
}

export function BrainNode({ position, index }: BrainNodeProps) {
  return (
    <div
      className="absolute w-3 h-3 animate-pulse bg-blue-200 rounded-full shadow-lg shadow-blue-400
      "
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        animationDelay: `${index * 0.1}s`,
        transition:
          "left 1s cubic-bezier(0.34, 1.56, 0.64, 1), top 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    />
  );
}

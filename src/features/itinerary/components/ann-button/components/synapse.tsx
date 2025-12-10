import {
  IPosition,
  ISynapse,
} from "@/features/itinerary/components/ann-button/types";

interface SynapseProps {
  synapse: ISynapse;
  fromPosition: IPosition;
  toPosition: IPosition;
  index: number;
}

export function Synapse({ synapse, fromPosition, toPosition }: SynapseProps) {
  return (
    <line
      x1={`${fromPosition.x}%`}
      y1={`${fromPosition.y}%`}
      x2={`${toPosition.x}%`}
      y2={`${toPosition.y}%`}
      stroke="rgba(34, 211, 238, 0.6)"
      strokeWidth="1.5"
      className="animate-pulse"
      style={{
        animationDelay: `${synapse.delay}s`,
        transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <animate
        attributeName="stroke-opacity"
        values="0.1;0.7;0.1"
        dur="1.5s"
        repeatCount="indefinite"
        begin={`${synapse.delay}s`}
      />
    </line>
  );
}

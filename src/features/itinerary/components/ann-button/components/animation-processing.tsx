import { AnimationProps } from "@/features/itinerary/components/ann-button/components/animation-idle";
import { BrainNode } from "@/features/itinerary/components/ann-button/components/brain-node";
import { Synapse } from "@/features/itinerary/components/ann-button/components/synapse";
import { CODE_LINES } from "@/features/itinerary/components/ann-button/constants";
import {
  generateSynapses,
  getNodePosition,
} from "@/features/itinerary/components/ann-button/helpers";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

function AnimationProcessing({ nodes, time, display }: AnimationProps) {
  const synapses = useMemo(
    () => generateSynapses(nodes.length),
    [nodes.length]
  );

  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-500 ease-in-out",
        display ? "opacity-100" : "opacity-0"
      )}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {synapses.map((synapse, i) => {
          const fromPos = getNodePosition(
            nodes[synapse.from],
            time,
            undefined,
            display
          );
          const toPos = getNodePosition(
            nodes[synapse.to],
            time,
            undefined,
            display
          );
          return (
            <Synapse
              key={`synapse-${i}`}
              synapse={synapse}
              fromPosition={fromPos}
              toPosition={toPos}
              index={i}
            />
          );
        })}
      </svg>

      {nodes.map((node, i) => {
        const pos = getNodePosition(node, time, undefined, display);
        return <BrainNode key={`brain-node-${i}`} position={pos} index={i} />;
      })}

      <div className="absolute inset-0 overflow-hidden opacity-20">
        {CODE_LINES.map((code, i) => (
          <div
            key={`code-${i}`}
            className="absolute text-xs font-mono text-green-300 whitespace-nowrap animate-slideRight"
            style={{
              top: `${i * 12}%`,
              left: "-30%",
              animationDelay: `${i * 0.3}s`,
              animationDuration: "2s",
            }}
          >
            {code}
          </div>
        ))}
      </div>

      {[...Array(3)].map((_, i) => (
        <div
          key={`think-pulse-${i}`}
          className="absolute left-1/2 top-1/2 w-20 h-20 -ml-10 -mt-10 border-2 border-blue-400 rounded-full animate-ping"
          style={{
            animationDelay: `${i * 0.8}s`,
            animationDuration: "2.5s",
            opacity: 0.3,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes slideRight {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(300%);
            opacity: 0;
          }
        }

        .animate-slideRight {
          animation: slideRight 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default AnimationProcessing;

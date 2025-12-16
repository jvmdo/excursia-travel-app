import { useState, useMemo, useEffect, ComponentPropsWithRef } from "react";

import {
  generateNodes,
  getNodePosition,
} from "@/features/itinerary/components/ann-button/helpers";
import { StatusIcon } from "@/features/itinerary/components/ann-button/components/status-icon";
import { cn } from "@/lib/utils";
import { ExpandingRings } from "@/features/itinerary/components/ann-button/components/expanding-rings";
import { ShadowGlow } from "@/features/itinerary/components/ann-button/components/shadow-glow";
import dynamic from "next/dynamic";

const AnnNode = dynamic(() => import("./components/ann-node"), { ssr: false });
const AnimationProcessing = dynamic(
  () => import("./components/animation-processing"),
  { ssr: false }
);
const AnimationSuccess = dynamic(
  () => import("./components/animation-success"),
  { ssr: false }
);

export type TButtonStatus = "idle" | "processing" | "success" | "error";

interface AnnButtonProps extends ComponentPropsWithRef<"button"> {
  status: TButtonStatus;
}

function AnnButton({ ref, status }: AnnButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState(0);
  const nodes = useMemo(() => generateNodes(), []);

  const isProcessing = status === "processing";
  const isIdle = status === "idle";
  const isClickable = isIdle || status === "error";

  useEffect(() => {
    if (!isHovered && !isProcessing) return;

    const interval = setInterval(() => {
      setTime((t) => t + 0.05);
    }, 50);

    return () => clearInterval(interval);
  }, [isHovered, isProcessing]);

  const getButtonText = (): string => {
    switch (status) {
      case "success":
        return "Roteiro gerado com sucesso!";
      case "error":
        return "Por favor, tente novamente.";
      case "processing":
        return "Gerando";
      default:
        return "Gerar Roteiro Completo";
    }
  };

  const getButtonColor = (): string => {
    switch (status) {
      case "success":
        return "from-green-500 to-emerald-600";
      case "error":
        return "from-red-500 to-rose-600";
      default:
        return "from-sky-500 via-cyan-400 to-purple-400";
    }
  };

  return (
    <button
      ref={ref}
      className="relative w-full"
      disabled={!isClickable}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: isProcessing ? "150px" : "48px",
        transition: "height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div
        className={cn(
          `relative z-10 px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-500 
          overflow-hidden h-full bg-linear-to-r ${getButtonColor()} text-white`,
          isClickable ? "cursor-pointer hover:shadow-2xl" : "cursor-default",
          isProcessing ? "cursor-wait" : ""
        )}
      >
        <span
          className={`
              relative z-20 flex items-center gap-3 left-1/2 top-1/2 -translate-1/2 w-fit 
              text-sm min-[24rem]:text-base min-[30rem]:text-lg
              drop-shadow-[0_0.5px_0.5px_rgba(0,0,0,0.8)]
          `}
        >
          <StatusIcon status={status} />
          {getButtonText()}
        </span>

        {(isIdle || isProcessing) &&
          nodes.map((node, i) => {
            const pos = getNodePosition(node, time, isHovered, isProcessing);
            return (
              <AnnNode
                key={`node-${i}`}
                node={node}
                position={pos}
                isProcessing={isProcessing}
                index={i}
              />
            );
          })}

        <AnimationProcessing display={isProcessing} nodes={nodes} time={time} />
        <AnimationSuccess display={status === "success"} />
      </div>

      <ExpandingRings display={isProcessing} />
      <ShadowGlow
        color={getButtonColor()}
        isHovered={isHovered}
        status={status}
      />
    </button>
  );
}

export default AnnButton;

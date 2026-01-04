import dynamic from "next/dynamic";
import React from "react";

import AnimationProcessing from "@/features/itinerary/components/ann-button/components/animation-processing";
import { ShadowGlow } from "@/features/itinerary/components/ann-button/components/shadow-glow";
import { StatusIcon } from "@/features/itinerary/components/ann-button/components/status-icon";
import { cn } from "@/lib/utils";

const AnimationSuccess = dynamic(
  () => import("./components/animation-success"),
  { ssr: false }
);

export type TButtonStatus = "idle" | "processing" | "success" | "error";

interface AnnButtonProps extends React.ComponentPropsWithRef<"button"> {
  status: TButtonStatus;
}

function AnnButton({ ref, status }: AnnButtonProps) {
  const [isHovering, setIsHovering] = React.useState(false);

  const isProcessing = status === "processing";
  const isIdle = status === "idle";
  const isClickable = isIdle || status === "error";

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
      disabled={!isClickable}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "relative w-full h-12 rounded-2xl font-semibold bg-linear-to-r text-white",
        getButtonColor(),
        isClickable ? "cursor-pointer" : "cursor-default",
        isProcessing ? "cursor-progress" : ""
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-3 text-sm min-[24rem]:text-base min-[30rem]:text-lg drop-shadow-[0_0.5px_0.5px_rgba(0,0,0,0.8)]">
        <StatusIcon status={status} />
        {getButtonText()}
      </span>
      <AnimationProcessing display={isProcessing} />
      <AnimationSuccess display={status === "success"} />
      <ShadowGlow
        color={getButtonColor()}
        isHovering={isHovering}
        status={status}
      />
    </button>
  );
}

export default AnnButton;

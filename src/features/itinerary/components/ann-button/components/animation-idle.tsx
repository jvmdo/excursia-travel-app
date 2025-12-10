import { getNodePosition } from "@/features/itinerary/components/ann-button/helpers";
import { INode } from "@/features/itinerary/components/ann-button/types";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import dynamic from "next/dynamic";

const NeuralNode = dynamic(() => import("./neural-node"), { ssr: false });

export interface AnimationProps extends ComponentProps<"div"> {
  nodes: INode[];
  time: number;
  display: boolean;
}

export function AnimationIdle({ nodes, time, display }: AnimationProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-700 ease-in-out",
        display ? "opacity-100" : "opacity-0"
      )}
    >
      {nodes.map((node, i) => {
        const pos = getNodePosition(node, time, true);
        const nextPos =
          i < nodes.length - 1
            ? getNodePosition(nodes[i + 1], time, true)
            : undefined;

        return (
          <NeuralNode
            key={`node-${i}`}
            node={node}
            position={pos}
            nextNodePosition={nextPos}
            index={i}
            showConnection={false}
          />
        );
      })}
    </div>
  );
}

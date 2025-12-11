import {
  INode,
  IPosition,
} from "@/features/itinerary/components/ann-button/types";

interface NodeProps {
  node: INode;
  position: IPosition;
  isProcessing: boolean;
  index: number;
}

function AnnNode({ node, position, isProcessing, index }: NodeProps) {
  return (
    <div
      className={`absolute rounded-full shadow-lg transition-all ${
        isProcessing
          ? "w-3 h-3 bg-cyan-300 shadow-cyan-400"
          : "w-2 h-2 bg-blue-200 shadow-blue-400"
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        animation: isProcessing
          ? `pulse ${1.5}s ease-in-out infinite ${index * 0.1}s`
          : `pulse ${node.duration}s ease-in-out infinite ${node.delay}s`,
        transition: isProcessing
          ? "left 1s cubic-bezier(0.34, 1.56, 0.64, 1), top 1s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.5s, height 0.5s, background-color 0.5s, box-shadow 0.5s"
          : "left 0.3s ease-out, top 0.3s ease-out, width 0.5s, height 0.5s, background-color 0.5s, box-shadow 0.5s",
      }}
    />
  );
}

export default AnnNode;

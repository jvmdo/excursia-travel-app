import {
  INode,
  IPosition,
} from "@/features/itinerary/components/ann-button/types";

interface NeuralNodeProps {
  node: INode;
  position: IPosition;
  nextNodePosition?: IPosition;
  index: number;
  showConnection: boolean;
}

function NeuralNode({
  node,
  position,
  nextNodePosition,
  showConnection,
}: NeuralNodeProps) {
  return (
    <div className="transition-all duration-300 ease-in-out">
      <div
        className="absolute w-2 h-2 bg-blue-200 rounded-full shadow-lg shadow-blue-400"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: "translate(-50%, -50%)",
          animation: `pulse ${node.duration}s ease-in-out infinite`,
          animationDelay: `${node.delay}s`,
          transition: "left 0.3s ease-out, top 0.3s ease-out",
        }}
      />
      {/* TODO: Probably dead code if don't merge with Brain */}
      {showConnection && nextNodePosition && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1={`${position.x}%`}
            y1={`${position.y}%`}
            x2={`${nextNodePosition.x}%`}
            y2={`${nextNodePosition.y}%`}
            stroke="rgb(255, 0, 0)"
            // stroke="rgba(147, 197, 253, 0.4)"
            // stroke="bg-blue-200"
            strokeWidth="1"
            style={{
              animation: `pulse ${node.duration}s ease-in-out infinite`,
              animationDelay: `${node.delay}s`,
              transition:
                "x1 0.3s ease-out, y1 0.3s ease-out, x2 0.3s ease-out, y2 0.3s ease-out",
            }}
          />
        </svg>
      )}
    </div>
  );
}

export default NeuralNode;

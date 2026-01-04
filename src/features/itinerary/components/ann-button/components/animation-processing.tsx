import { cn } from "@/lib/utils";

export interface AnimationProcessingProps {
  display: boolean;
}

function AnimationProcessing({ display }: AnimationProcessingProps) {
  return (
    <>
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-in-out overflow-hidden rounded-2xl",
          display ? "opacity-20" : "opacity-0"
        )}
      >
        {CODE_LINES.map((code, i) => (
          <div
            key={`code-${i}`}
            className="absolute text-xs font-mono text-green-300 animate-slide-right"
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
      {display && (
        <>
          <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-ping opacity-40" />
          <div
            className="absolute inset-0 rounded-2xl border-2 border-purple-400 animate-ping opacity-30"
            style={{ animationDelay: "0.5s", animationDuration: "2s" }}
          />
          <div
            className="absolute inset-0 rounded-2xl border-2 border-cyan-400 animate-ping opacity-20"
            style={{ animationDelay: "1s", animationDuration: "2.5s" }}
          />
        </>
      )}
    </>
  );
}

export default AnimationProcessing;

const CODE_LINES = [
  "import tensorflow as tf",
  "01101000 01100101 01101100",
  "const model = await load()",
  "11010011 10101110 00110101",
  "def train_model(data):",
  "01110011 01110100 01100001",
  "neural_net.forward(x)",
  "10100110 11001001 01010011",
];

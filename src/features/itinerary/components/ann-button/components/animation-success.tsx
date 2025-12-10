import { useState } from "react";

function AnimationSuccess({ display }: { display: boolean }) {
  const [checkMarks] = useState(() =>
    Array.from({ length: 20 }, () => ({
      left: Math.random(),
      top: Math.random(),
    }))
  );

  if (!display) return null;

  return (
    <div className="absolute inset-0">
      {checkMarks.map(({ left, top }, i) => (
        <svg
          key={`check-${i}`}
          className="absolute w-4 h-4 text-white opacity-30 animate-float"
          style={{
            left: `${left * 100}%`,
            top: `${top * 100}%`,
            animationDelay: `${i * 0.1}s`,
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ))}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          50% {
            transform: translateY(-30px) translateX(15px);
            opacity: 1;
          }
          90% {
            opacity: 0.7;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default AnimationSuccess;

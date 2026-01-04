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
          className="absolute w-4 h-4 text-white opacity-30 animate-rain-drop"
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
    </div>
  );
}

export default AnimationSuccess;

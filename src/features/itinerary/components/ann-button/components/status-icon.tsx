import { TButtonStatus } from "@/features/itinerary/components/ann-button";

interface ButtonIconProps {
  status: TButtonStatus;
}

export function StatusIcon({ status }: ButtonIconProps) {
  if (status === "processing") {
    return (
      <div className="relative w-6 h-6">
        <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <div
          className="absolute inset-1 border-2 border-white border-b-transparent rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
        />
      </div>
    );
  }

  if (status === "success") {
    return (
      <svg
        className="w-6 h-6 animate-bounce"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  }

  if (status === "error") {
    return (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    );
  }

  return (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  );
}

export function ExpandingRings({ display }: { display: boolean }) {
  if (!display) return null;

  return (
    <>
      <div
        className={
          "absolute inset-0 rounded-2xl border-2 border-blue-400 animate-ping opacity-40"
        }
      />
      <div
        className="absolute inset-0 rounded-2xl border-2 border-purple-400 animate-ping opacity-30"
        style={{ animationDelay: "0.5s", animationDuration: "2s" }}
      />
      <div
        className="absolute inset-0 rounded-2xl border-2 border-cyan-400 animate-ping opacity-20"
        style={{ animationDelay: "1s", animationDuration: "2.5s" }}
      />
    </>
  );
}

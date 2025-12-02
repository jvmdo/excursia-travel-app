"use client";

export function SavedItineraryItem({
  itinerary,
  index,
  onLoad,
  onDelete,
}: {
  itinerary: {
    destination: string;
    days: number;
    html: string;
    date: string;
  };
  index: number;
  onLoad: (index: number) => void;
  onDelete: (index: number) => void;
}) {
  return (
    <div
      className="p-4 border rounded-lg cursor-pointer hover:bg-accent hover:border-sky-400 transition"
      onClick={() => onLoad(index)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold flex items-center gap-1">
          🗺️ {itinerary.destination}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
          className="text-orange-500 hover:text-orange-600 text-xl"
        >
          ×
        </button>
      </div>

      <div className="text-sm text-muted-foreground">
        📅 {itinerary.days} dias •{" "}
        {new Date(itinerary.date).toLocaleDateString("pt-BR")}
      </div>
    </div>
  );
}

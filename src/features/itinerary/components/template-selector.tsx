"use client";

export const TEMPLATES = [
  {
    icon: "⛰️",
    label: "Aventura",
    value: "Aventura, trilhas e paisagens naturais",
  },
  {
    icon: "🏛️",
    label: "Cultura",
    value: "Museus, história e gastronomia local",
  },
  {
    icon: "🏖️",
    label: "Praia",
    value: "Praias, relaxamento e vida noturna",
  },
  {
    icon: "💸",
    label: "Low Cost",
    value: "Viagem econômica, passeios gratuitos e transporte barato",
  },
];

export function TemplateSelector({
  onSelect,
}: {
  onSelect: (templateValue: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {TEMPLATES.map((tpl) => (
        <button
          key={tpl.label}
          onClick={() => onSelect(tpl.value)}
          className="px-2 py-1 rounded-lg border border-border bg-white shadow-sm
                     hover:bg-accent transition-all flex items-center gap-2
                     hover:scale-[1.03] active:scale-95 text-sm"
        >
          <span className="text-sm animate-pulse">{tpl.icon}</span>
          {tpl.label}
        </button>
      ))}
    </div>
  );
}

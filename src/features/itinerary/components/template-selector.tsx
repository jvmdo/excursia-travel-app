"use client";

export const TEMPLATES = [
  {
    icon: "⛰️",
    label: "Aventura",
    value: "Aventura, trilhas, paisagens naturais",
  },
  {
    icon: "🏛️",
    label: "Cultura",
    value: "Museus, história, gastronomia local",
  },
  {
    icon: "🏖️",
    label: "Praia",
    value: "Praias, relaxamento, vida noturna",
  },
  {
    icon: "💸",
    label: "Low Cost",
    value: "Viagem econômica, passeios gratuitos, transporte barato",
  },
];

interface PreferencesTemplatesProps {
  onSelect: (templateValue: string) => void;
}

export function PreferencesTemplates({ onSelect }: PreferencesTemplatesProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 mt-2">
      {TEMPLATES.map(({ icon, label, value }) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect(value)}
          className="flex items-center gap-2 text-sm px-2 py-1 rounded-lg border shadow-sm 
                     transition-all hover:bg-accent hover:scale-[1.03] active:scale-95"
        >
          <span className="text-sm animate-pulse">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}

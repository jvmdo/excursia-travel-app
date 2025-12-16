"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ItineraryData } from "@/app/api/generate-itinerary/route";

interface SavedItineraryComboboxProps
  extends React.ComponentProps<typeof Button> {
  itineraries: ItineraryData[];
  onSelected: (id: string) => void;
}

export function SavedItineraryCombobox({
  itineraries,
  onSelected,
  className,
  ...delegated
}: SavedItineraryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [itId, setItId] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...delegated}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between truncate hover:bg-sky-50 hover:border-sky-400",
            className
          )}
        >
          <p className="truncate">
            {itId
              ? itineraries.find((it) => it.id === itId)?.destination
              : "Ver todos os roteiros"}
          </p>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder="Selecione um roteiro" className="h-9" />
          <CommandList>
            <CommandEmpty>Nenhum roteiro encontrado.</CommandEmpty>
            <CommandGroup>
              {itineraries.map((it) => (
                <CommandItem
                  key={it.id}
                  value={it.id}
                  keywords={it.destination.split(",")}
                  onSelect={(currentId) => {
                    setItId(currentId === itId ? "" : currentId);
                    setOpen(false);
                    onSelected(currentId);
                  }}
                >
                  <p className="flex flex-col truncate">
                    <span className="truncate">{it.destination}</span>
                    <span className="text-xs text-gray-500">
                      {it.numberOfDays} •{" "}
                      {new Date(it.createdAt * 1000).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  </p>
                  <Check
                    className={cn(
                      "ml-auto",
                      itId === it.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

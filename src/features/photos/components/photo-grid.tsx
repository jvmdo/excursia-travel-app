"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Download, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Photo } from "./photo-gallery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";

interface PhotoGridProps {
  photos: Photo[];
  onDeletePhoto: (id: string) => void;
}

export function PhotoGrid({ photos, onDeletePhoto }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleDownload = (photo: Photo) => {
    const link = document.createElement("a");
    link.href = photo.url;
    link.download = photo.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative aspect-square rounded-xl overflow-hidden bg-muted animate-scale-in cursor-pointer"
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
            onMouseEnter={() => setHoveredId(photo.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.url || "/placeholder.svg"}
              alt={photo.name}
              fill
              className={cn(
                "object-cover transition-transform duration-500",
                hoveredId === photo.id && "scale-110"
              )}
            />

            {/* Overlay on hover */}
            <div
              className={cn(
                "absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300",
                hoveredId === photo.id ? "opacity-100" : "opacity-0"
              )}
            >
              {/* Photo info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                <p className="text-white text-sm font-medium truncate">
                  {photo.name}
                </p>
                <p className="text-white/70 text-xs">
                  {(photo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/90 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(photo);
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePhoto(photo.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Zoom indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      <Dialog
        open={!!selectedPhoto}
        onOpenChange={() => setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedPhoto && (
            <div className="relative">
              <div className="relative w-full h-[70vh]">
                <Image
                  src={selectedPhoto.url || "/placeholder.svg"}
                  alt={selectedPhoto.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6 bg-card space-y-2">
                <DialogTitle className="text-xl font-semibold">
                  {selectedPhoto.name}
                </DialogTitle>
                <DialogDescription>
                  {(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB • Enviado
                  em {selectedPhoto.uploadedAt.toLocaleDateString("pt-BR")}
                </DialogDescription>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleDownload(selectedPhoto)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      onDeletePhoto(selectedPhoto.id);
                      setSelectedPhoto(null);
                    }}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

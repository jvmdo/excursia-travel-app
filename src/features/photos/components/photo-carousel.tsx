"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Trash2, X } from "lucide-react"
import type { Photo } from "./photo-gallery"

interface PhotoCarouselProps {
  photos: Photo[]
  onDeletePhoto: (id: string) => void
}

export function PhotoCarousel({ photos, onDeletePhoto }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const handleDownload = (photo: Photo) => {
    const link = document.createElement("a")
    link.href = photo.url
    link.download = photo.name
    link.click()
  }

  const handleDelete = (id: string) => {
    onDeletePhoto(id)
    if (currentIndex >= photos.length - 1) {
      setCurrentIndex(Math.max(0, photos.length - 2))
    }
  }

  const currentPhoto = photos[currentIndex]

  if (!currentPhoto) return null

  return (
    <>
      {/* Carousel Principal - Otimizado para mobile */}
      <div className="relative bg-card rounded-xl md:rounded-2xl border border-border overflow-hidden shadow-xl">
        <div
          className="relative aspect-[4/3] md:aspect-video bg-muted flex items-center justify-center cursor-pointer group touch-manipulation"
          onClick={() => setIsFullscreen(true)}
        >
          <img
            src={currentPhoto.url || "/placeholder.svg"}
            alt="Foto"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              handlePrevious()
            }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm h-12 w-12 md:h-10 md:w-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm h-12 w-12 md:h-10 md:w-10"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-3 md:p-4 space-y-3 md:space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm md:text-base text-muted-foreground">
              Foto {currentIndex + 1} de {photos.length}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDownload(currentPhoto)}
                className="hover:scale-110 transition-transform h-9 w-9 md:h-10 md:w-10"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(currentPhoto.id)}
                className="text-destructive hover:text-destructive hover:scale-110 transition-transform h-9 w-9 md:h-10 md:w-10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0 scrollbar-thin snap-x snap-mandatory">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 snap-start touch-manipulation ${
                  index === currentIndex
                    ? "border-primary ring-2 ring-primary/20 scale-105"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Fullscreen - Otimizado para mobile */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-scale-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:bg-white/20 h-12 w-12 md:h-10 md:w-10"
          >
            <X className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="absolute left-2 md:left-4 text-white hover:bg-white/20 h-12 w-12 md:h-10 md:w-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-2 md:right-4 text-white hover:bg-white/20 h-12 w-12 md:h-10 md:w-10"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          <img
            src={currentPhoto.url || "/placeholder.svg"}
            alt="Foto"
            className="max-w-[95vw] max-h-[85vh] md:max-w-[90vw] md:max-h-[90vh] object-contain"
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}

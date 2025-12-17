"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FolderPlus } from "lucide-react"
import type { Photo } from "./photo-gallery"

interface AlbumCreatorProps {
  photos: Photo[]
  onCreateAlbum: (name: string, coverPhotoUrl?: string) => void
  isPrimary?: boolean
}

export function AlbumCreator({ photos, onCreateAlbum, isPrimary = false }: AlbumCreatorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [albumName, setAlbumName] = useState("")
  const [selectedCover, setSelectedCover] = useState<string | null>(null)
  const [customCoverUrl, setCustomCoverUrl] = useState("")

  const handleCreate = () => {
    if (albumName.trim()) {
      const coverUrl = customCoverUrl.trim() || selectedCover || photos[0]?.url
      onCreateAlbum(albumName.trim(), coverUrl)
      setAlbumName("")
      setSelectedCover(null)
      setCustomCoverUrl("")
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isPrimary ? (
          <Button
            size="lg"
            className="gap-2 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-primary hover:bg-primary/90"
          >
            <FolderPlus className="w-6 h-6" />
            Criar Álbum
          </Button>
        ) : (
          <Button variant="default" className="gap-2">
            <FolderPlus className="w-4 h-4" />
            Criar Álbum
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display">Criar Álbum com Fotos Atuais</DialogTitle>
          <DialogDescription>
            Dê um nome ao álbum e escolha uma capa. Todas as {photos.length} fotos atuais serão adicionadas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          <div className="space-y-2">
            <Label htmlFor="album-name">Nome do Álbum</Label>
            <Input
              id="album-name"
              placeholder="Ex: Viagem à praia 2025"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>

          <div className="space-y-2 flex-1 flex flex-col overflow-hidden">
            <Label>Escolha a Capa do Álbum</Label>
            <ScrollArea className="flex-1 h-[200px] rounded-lg border border-border p-2">
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => {
                      setSelectedCover(photo.url)
                      setCustomCoverUrl("")
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedCover === photo.url ? "border-primary ring-2 ring-primary/20" : "border-border"
                    }`}
                  >
                    <img src={photo.url || "/placeholder.svg"} alt="Capa" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-cover">Ou cole o URL de outra foto</Label>
            <div className="flex gap-2">
              <Input
                id="custom-cover"
                placeholder="https://exemplo.com/foto.jpg"
                value={customCoverUrl}
                onChange={(e) => {
                  setCustomCoverUrl(e.target.value)
                  setSelectedCover(null)
                }}
              />
              {customCoverUrl && (
                <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-primary flex-shrink-0">
                  <img
                    src={customCoverUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!albumName.trim()}>
            <FolderPlus className="w-4 h-4 mr-2" />
            Criar Álbum
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, FolderOpen, MoreVertical, Pencil, Trash2, Images } from "lucide-react"
import type { Album } from "./photo-gallery"

interface AlbumManagerProps {
  albums: Album[]
  selectedAlbumId: string | null
  onSelectAlbum: (id: string | null) => void
  onCreateAlbum: (name: string) => string
  onRenameAlbum: (id: string, name: string) => void
  onDeleteAlbum: (id: string) => void
  unassignedCount: number
}

export function AlbumManager({
  albums,
  selectedAlbumId,
  onSelectAlbum,
  onCreateAlbum,
  onRenameAlbum,
  onDeleteAlbum,
  unassignedCount,
}: AlbumManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAlbumName, setNewAlbumName] = useState("")
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const handleCreateAlbum = () => {
    if (newAlbumName.trim()) {
      const newId = onCreateAlbum(newAlbumName.trim())
      onSelectAlbum(newId)
      setNewAlbumName("")
      setIsCreateDialogOpen(false)
    }
  }

  const handleRenameAlbum = (id: string) => {
    if (editingName.trim()) {
      onRenameAlbum(id, editingName.trim())
      setEditingAlbumId(null)
      setEditingName("")
    }
  }

  return (
    <div className="animate-slide-in-right">
      <div className="flex items-center gap-3 mb-4">
        <FolderOpen className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold font-display">Meus Álbuns</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedAlbumId === null ? "default" : "outline"}
          onClick={() => onSelectAlbum(null)}
          className="gap-2 transition-all hover:scale-105"
        >
          <Images className="w-4 h-4" />
          Todas as Fotos
          <span className="text-xs opacity-70">({unassignedCount})</span>
        </Button>

        {albums.map((album) => (
          <div key={album.id} className="relative group">
            {editingAlbumId === album.id ? (
              <div className="flex gap-1 bg-card border border-border rounded-lg p-2">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameAlbum(album.id)
                    if (e.key === "Escape") {
                      setEditingAlbumId(null)
                      setEditingName("")
                    }
                  }}
                  className="h-8 text-sm w-32"
                  autoFocus
                />
                <Button size="sm" onClick={() => handleRenameAlbum(album.id)} className="h-8">
                  OK
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  variant={selectedAlbumId === album.id ? "default" : "outline"}
                  onClick={() => onSelectAlbum(album.id)}
                  className="gap-2 transition-all hover:scale-105"
                >
                  <FolderOpen className="w-4 h-4" />
                  {album.name}
                  <span className="text-xs opacity-70">({album.photoCount})</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingAlbumId(album.id)
                        setEditingName(album.name)
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Renomear
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteAlbum(album.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        ))}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 hover:scale-105 transition-all bg-transparent">
              <Plus className="w-4 h-4" />
              Novo Álbum Vazio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Criar Álbum Vazio</DialogTitle>
              <DialogDescription>Crie um álbum vazio para adicionar fotos depois.</DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Nome do álbum..."
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateAlbum()}
              className="mt-4"
              autoFocus
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateAlbum} disabled={!newAlbumName.trim()}>
                Criar Álbum
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

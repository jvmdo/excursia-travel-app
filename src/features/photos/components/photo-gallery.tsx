"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { PhotoUploadZone } from "./photo-upload-zone";
import { PhotoCarousel } from "./photo-carousel";
import { AlbumExporter } from "./album-exporter";
import { AlbumCreator } from "./album-creator";
import { CloudAlbumsViewer } from "./cloud-albums-viewer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PartyPopper,
  FolderOpen,
  ArrowLeft,
  Calendar,
  ImageIcon,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { db } from "@/lib/db";

export interface Photo {
  id: string;
  url: string;
  name: string;
  size: number;
  uploadedAt: Date;
  albumId?: string;
}

export interface Album {
  id: string;
  name: string;
  createdAt: Date;
  photoCount: number;
  coverPhoto?: string;
}

export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"create" | "view">("create");
  const [renameAlbumId, setRenameAlbumId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteAlbumId, setDeleteAlbumId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = async () => {
    try {
      const localAlbums = await db.albums.toArray();
      const formattedAlbums: Album[] = [];

      for (const album of localAlbums) {
        const photoCount = await db.photos
          .where("albumId")
          .equals(album.id)
          .count();

        let coverPhotoUrl: string | undefined;
        if (album.coverPhotoId) {
          const coverPhoto = await db.photos.get(album.coverPhotoId);
          if (coverPhoto) {
            coverPhotoUrl = URL.createObjectURL(coverPhoto.blob);
          }
        }

        formattedAlbums.push({
          id: album.id,
          name: album.name,
          createdAt: album.createdAt,
          photoCount,
          coverPhoto: coverPhotoUrl,
        });
      }

      setAlbums(
        formattedAlbums.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );

      const localPhotos = await db.photos.toArray();
      const formattedPhotos: Photo[] = localPhotos.map((photo) => ({
        id: photo.id,
        url: URL.createObjectURL(photo.blob),
        name: photo.name,
        size: photo.size,
        uploadedAt: photo.uploadedAt,
        albumId: photo.albumId,
      }));

      setPhotos(
        formattedPhotos.sort(
          (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
        )
      );
    } catch (error) {
      console.error("Erro ao carregar dados locais:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unassignedPhotos = photos.filter((photo) => !photo.albumId);
  const displayPhotos = selectedAlbumId
    ? photos.filter((photo) => photo.albumId === selectedAlbumId)
    : unassignedPhotos;

  const handlePhotosUploaded = useCallback((newPhotos: Photo[]) => {
    setPhotos((prev) => [...newPhotos, ...prev]);
  }, []);

  const handleDeletePhoto = useCallback(
    async (id: string) => {
      try {
        const photo = photos.find((p) => p.id === id);

        await db.photos.delete(id);

        setPhotos((prev) => prev.filter((p) => p.id !== id));

        if (photo?.albumId) {
          setAlbums((prev) =>
            prev.map((album) =>
              album.id === photo.albumId
                ? { ...album, photoCount: Math.max(0, album.photoCount - 1) }
                : album
            )
          );
        }
      } catch (error) {
        console.error("Erro ao deletar foto:", error);
      }
    },
    [photos]
  );

  const handleRenameAlbum = useCallback(async (id: string, newName: string) => {
    try {
      await db.albums.update(id, { name: newName });
      setAlbums((prev) =>
        prev.map((album) =>
          album.id === id ? { ...album, name: newName } : album
        )
      );
    } catch (error) {
      console.error("Erro ao renomear álbum:", error);
    }
  }, []);

  const handleDeleteAlbum = useCallback(
    async (id: string) => {
      try {
        await db.photos.where("albumId").equals(id).delete();
        await db.albums.delete(id);

        setPhotos((prev) => prev.filter((photo) => photo.albumId !== id));
        setAlbums((prev) => prev.filter((album) => album.id !== id));

        if (selectedAlbumId === id) {
          setSelectedAlbumId(null);
        }
      } catch (error) {
        console.error("Erro ao deletar álbum:", error);
      }
    },
    [selectedAlbumId]
  );

  const handleOpenRename = useCallback(
    (albumId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const album = albums.find((a) => a.id === albumId);
      if (album) {
        setRenameAlbumId(albumId);
        setRenameValue(album.name);
      }
    },
    [albums]
  );

  const handleConfirmRename = useCallback(() => {
    if (renameAlbumId && renameValue.trim()) {
      handleRenameAlbum(renameAlbumId, renameValue.trim());
      setRenameAlbumId(null);
      setRenameValue("");
    }
  }, [renameAlbumId, renameValue, handleRenameAlbum]);

  const handleOpenDelete = useCallback(
    (albumId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setDeleteAlbumId(albumId);
    },
    []
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteAlbumId) {
      handleDeleteAlbum(deleteAlbumId);
      setDeleteAlbumId(null);
    }
  }, [deleteAlbumId, handleDeleteAlbum]);

  const handleCreateAlbumWithPhotos = useCallback(
    async (name: string, coverPhotoUrl?: string) => {
      try {
        const albumId = `album-${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}`;

        const coverPhotoId = coverPhotoUrl
          ? unassignedPhotos.find((p) => p.url === coverPhotoUrl)?.id
          : unassignedPhotos[0]?.id;

        await db.albums.add({
          id: albumId,
          name,
          createdAt: new Date(),
          coverPhotoId,
        });

        const photoIds = unassignedPhotos.map((p) => p.id);
        await Promise.all(
          photoIds.map((photoId) => db.photos.update(photoId, { albumId }))
        );

        const newAlbum: Album = {
          id: albumId,
          name,
          createdAt: new Date(),
          photoCount: unassignedPhotos.length,
          coverPhoto: coverPhotoUrl,
        };

        setPhotos((prev) =>
          prev.map((photo) =>
            photoIds.includes(photo.id) ? { ...photo, albumId } : photo
          )
        );

        setAlbums((prev) => [newAlbum, ...prev]);
        setSelectedAlbumId(albumId);
        setShowThankYouDialog(true);
      } catch (error) {
        console.error("Erro ao criar álbum:", error);
      }
    },
    [unassignedPhotos]
  );

  const handleCreateAnother = useCallback(() => {
    setShowThankYouDialog(false);
    setSelectedAlbumId(null);
    setViewMode("create");
    setPhotos((prev) => prev.filter((photo) => photo.albumId));
  }, []);

  const handleFinish = useCallback(() => {
    setShowThankYouDialog(false);
  }, []);

  const handleViewAlbum = useCallback((albumId: string) => {
    setSelectedAlbumId(albumId);
    setViewMode("view");
  }, []);

  const handleBackToAlbums = useCallback(() => {
    setSelectedAlbumId(null);
    setViewMode("view");
  }, []);

  const handleBackToCreate = useCallback(() => {
    setSelectedAlbumId(null);
    setViewMode("create");
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">
          Carregando seus álbuns...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant={viewMode === "create" ? "default" : "outline"}
          onClick={handleBackToCreate}
          className="gap-2"
          size="lg"
        >
          Criar Novo Álbum
        </Button>
        <Button
          variant={viewMode === "view" ? "default" : "outline"}
          onClick={() => setViewMode("view")}
          className="gap-2"
          size="lg"
        >
          <FolderOpen className="w-5 h-5" />
          Meus Álbuns ({albums.length})
        </Button>
        <CloudAlbumsViewer />
      </div>

      {viewMode === "create" && (
        <>
          {!selectedAlbumId && (
            <PhotoUploadZone onPhotosUploaded={handlePhotosUploaded} />
          )}

          {unassignedPhotos.length > 0 && !selectedAlbumId && (
            <div className="bg-linear-to-r from-primary/20 via-primary/10 to-transparent border-2 border-primary/30 rounded-2xl p-6 md:p-8 shadow-lg animate-slide-up">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-2">
                    Pronto para criar seu álbum?
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground">
                    Você tem {unassignedPhotos.length}{" "}
                    {unassignedPhotos.length === 1 ? "foto" : "fotos"} esperando
                    para serem organizadas
                  </p>
                </div>
                <AlbumCreator
                  photos={unassignedPhotos}
                  onCreateAlbum={handleCreateAlbumWithPhotos}
                  isPrimary
                />
              </div>
            </div>
          )}

          {!selectedAlbumId && photos.length === 0 && (
            <div className="text-center py-12 text-muted-foreground animate-float">
              <p className="text-base md:text-lg">Nenhuma álbum ainda.</p>
            </div>
          )}
        </>
      )}

      {viewMode === "view" && !selectedAlbumId && (
        <div className="animate-slide-up">
          {albums.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
              <p className="text-lg text-muted-foreground">
                Nenhum álbum criado ainda.
              </p>
              <Button
                onClick={handleBackToCreate}
                variant="outline"
                className="gap-2 bg-transparent"
              >
                Criar Primeiro Álbum
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <div
                    onClick={() => handleViewAlbum(album.id)}
                    className="aspect-square bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden cursor-pointer"
                  >
                    {album.coverPhoto ? (
                      <img
                        src={album.coverPhoto || "/placeholder.svg"}
                        alt={album.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-primary/30" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => handleViewAlbum(album.id)}
                        className="font-display font-semibold text-lg truncate flex-1 cursor-pointer hover:text-primary transition-colors"
                      >
                        {album.name}
                      </h4>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={(e) => handleOpenRename(album.id, e)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => handleOpenDelete(album.id, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        <span>
                          {album.photoCount}{" "}
                          {album.photoCount === 1 ? "foto" : "fotos"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(album.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedAlbumId && displayPhotos.length > 0 && (
        <div className="animate-slide-up space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={
                  viewMode === "view" ? handleBackToAlbums : handleBackToCreate
                }
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold font-display text-foreground">
                  {albums.find((a) => a.id === selectedAlbumId)?.name}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {displayPhotos.length}{" "}
                  {displayPhotos.length === 1 ? "foto" : "fotos"}
                </span>
              </div>
            </div>

            <AlbumExporter
              photos={displayPhotos}
              albumName={
                albums.find((a) => a.id === selectedAlbumId)?.name || "Álbum"
              }
              albumId={selectedAlbumId}
            />
          </div>

          <PhotoCarousel
            photos={displayPhotos}
            onDeletePhoto={handleDeletePhoto}
          />
        </div>
      )}

      <Dialog open={showThankYouDialog} onOpenChange={setShowThankYouDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <PartyPopper className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="font-display text-2xl">
              Álbum Criado com Sucesso!
            </DialogTitle>
            <DialogDescription className="text-base">
              Obrigado por usar nosso site. Seu álbum foi criado e está pronto
              para ser exportado.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 text-center">
            <p className="text-lg font-semibold text-foreground mb-2">
              Deseja criar outro álbum?
            </p>
            <p className="text-sm text-muted-foreground">
              Você poderá fazer importar novas fotos e criar um novo álbum.
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleFinish}
              className="w-full sm:w-auto bg-transparent"
            >
              Não, obrigado
            </Button>
            <Button onClick={handleCreateAnother} className="w-full sm:w-auto">
              Sim, criar outro álbum
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!renameAlbumId}
        onOpenChange={() => setRenameAlbumId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Renomear Álbum</DialogTitle>
            <DialogDescription>
              Digite o novo nome para o álbum.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="Nome do álbum"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirmRename();
              }}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameAlbumId(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmRename}
              disabled={!renameValue.trim()}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteAlbumId}
        onOpenChange={() => setDeleteAlbumId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Deletar Álbum</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar este álbum? Todas as fotos serão
              removidas e esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAlbumId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

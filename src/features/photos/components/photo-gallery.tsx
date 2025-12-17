"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { PhotoUploadZone } from "./photo-upload-zone";
import { PhotoCarousel } from "./photo-carousel";
import { AlbumExporter } from "./album-exporter";
import { AlbumCreator } from "./album-creator";
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
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export interface Photo {
  id: string;
  url: string;
  name: string;
  size: number;
  uploadedAt: Date;
  albumId?: string;
  userId?: string;
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
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    loadUserAndData();
  }, []);

  const loadUserAndData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await loadAlbums(user.id);
        await loadPhotos(user.id);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAlbums = async (userId: string) => {
    const { data, error } = await supabase
      .from("albums")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar álbuns:", error);
      return;
    }

    if (data) {
      const formattedAlbums: Album[] = data.map((album) => ({
        id: album.id,
        name: album.name,
        createdAt: new Date(album.created_at),
        photoCount: 0,
        coverPhoto: album.cover_url || undefined,
      }));
      setAlbums(formattedAlbums);

      // Carregar contagem de fotos para cada álbum
      for (const album of formattedAlbums) {
        const { count } = await supabase
          .from("photos")
          .select("*", { count: "exact", head: true })
          .eq("album_id", album.id);

        setAlbums((prev) =>
          prev.map((a) =>
            a.id === album.id ? { ...a, photoCount: count || 0 } : a
          )
        );
      }
    }
  };

  const loadPhotos = async (userId: string) => {
    const { data: albumsData } = await supabase
      .from("albums")
      .select("id")
      .eq("user_id", userId);

    if (!albumsData) return;

    const albumIds = albumsData.map((a) => a.id);

    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .in("album_id", albumIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar fotos:", error);
      return;
    }

    if (data) {
      const formattedPhotos: Photo[] = data.map((photo) => ({
        id: photo.id,
        url: photo.url,
        name: photo.name,
        size: photo.size,
        uploadedAt: new Date(photo.created_at),
        albumId: photo.album_id,
        userId: photo.user_id,
      }));
      setPhotos(formattedPhotos);
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
      const photo = photos.find((p) => p.id === id);

      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          id
        );

      if (isUUID && photo) {
        try {
          // Extrair o caminho do arquivo da URL
          const url = new URL(photo.url);
          const pathMatch = url.pathname.match(
            /\/storage\/v1\/object\/public\/photos\/(.+)$/
          );

          if (pathMatch && pathMatch[1]) {
            const filePath = pathMatch[1];

            // Deletar do Storage
            const { error: storageError } = await supabase.storage
              .from("photos")
              .remove([filePath]);

            if (storageError) {
              console.error("Erro ao deletar do storage:", storageError);
            }
          }

          // Deletar do banco de dados
          const { error } = await supabase.from("photos").delete().eq("id", id);

          if (error) {
            console.error("Erro ao deletar foto:", error);
            return;
          }
        } catch (error) {
          console.error("Erro ao processar deleção:", error);
          return;
        }
      }

      // Remover do estado local independentemente
      setPhotos((prev) => prev.filter((photo) => photo.id !== id));

      if (photo?.albumId) {
        setAlbums((prev) =>
          prev.map((album) =>
            album.id === photo.albumId
              ? { ...album, photoCount: Math.max(0, album.photoCount - 1) }
              : album
          )
        );
      }
    },
    [photos, supabase]
  );

  const handleCreateAlbum = useCallback((name: string) => {
    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      name,
      createdAt: new Date(),
      photoCount: 0,
    };
    setAlbums((prev) => [...prev, newAlbum]);
    return newAlbum.id;
  }, []);

  const handleRenameAlbum = useCallback(
    async (id: string, newName: string) => {
      const { error } = await supabase
        .from("albums")
        .update({ name: newName, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        console.error("Erro ao renomear álbum:", error);
        return;
      }

      setAlbums((prev) =>
        prev.map((album) =>
          album.id === id ? { ...album, name: newName } : album
        )
      );
    },
    [supabase]
  );

  const handleDeleteAlbum = useCallback(
    async (id: string) => {
      // Remover fotos do álbum no Supabase (CASCADE já remove automaticamente)
      const { error } = await supabase.from("albums").delete().eq("id", id);

      if (error) {
        console.error("Erro ao deletar álbum:", error);
        return;
      }

      // Remover fotos do estado local
      setPhotos((prev) => prev.filter((photo) => photo.albumId !== id));
      setAlbums((prev) => prev.filter((album) => album.id !== id));

      if (selectedAlbumId === id) {
        setSelectedAlbumId(null);
      }
    },
    [selectedAlbumId, supabase]
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
      if (!userId) return;

      // Criar álbum no Supabase
      const { data: newAlbumData, error: albumError } = await supabase
        .from("albums")
        .insert({
          user_id: userId,
          name,
          cover_url: coverPhotoUrl,
        })
        .select()
        .single();

      if (albumError || !newAlbumData) {
        console.error("Erro ao criar álbum:", albumError);
        return;
      }

      const newAlbum: Album = {
        id: newAlbumData.id,
        name: newAlbumData.name,
        createdAt: new Date(newAlbumData.created_at),
        photoCount: unassignedPhotos.length,
        coverPhoto: newAlbumData.cover_url || undefined,
      };

      const photosToInsert = unassignedPhotos.map((photo) => ({
        album_id: newAlbum.id,
        // user_id: userId,
        url: photo.url,
        name: photo.name,
        size: photo.size,
      }));

      const { error: photosError } = await supabase
        .from("photos")
        .insert(photosToInsert);

      if (photosError) {
        console.error("Erro ao adicionar fotos:", photosError);
        return;
      }

      // Atualizar estado local
      const photoIdsToMove = new Set(unassignedPhotos.map((p) => p.id));
      setPhotos((prev) =>
        prev.map((photo) =>
          photoIdsToMove.has(photo.id)
            ? { ...photo, albumId: newAlbum.id }
            : photo
        )
      );

      setAlbums((prev) => [...prev, newAlbum]);
      setSelectedAlbumId(newAlbum.id);
      setShowThankYouDialog(true);
    },
    [unassignedPhotos, userId, supabase]
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
              <p className="text-base md:text-lg">
                Nenhuma foto ainda. Comece fazendo upload!
              </p>
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
            />
          </div>

          <PhotoCarousel
            photos={displayPhotos}
            onDeletePhoto={handleDeletePhoto}
          />
        </div>
      )}

      {/* ... existing dialog code ... */}
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
              Você poderá fazer upload de novas fotos e criar um novo álbum.
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
                if (e.key === "Enter") {
                  handleConfirmRename();
                }
              }}
              className="text-base"
              autoFocus
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setRenameAlbumId(null)}
              className="w-full sm:w-auto bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmRename}
              disabled={!renameValue.trim()}
              className="w-full sm:w-auto"
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
            <DialogTitle className="font-display text-destructive">
              Excluir Álbum
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este álbum? As fotos serão
              excluídas permanentemente.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 text-center">
            <p className="text-base text-muted-foreground">
              Esta ação não pode ser desfeita.
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteAlbumId(null)}
              className="w-full sm:w-auto bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto"
            >
              Excluir Álbum
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

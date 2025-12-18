"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cloud, Download, Loader2, Calendar, FileText } from "lucide-react";
import { pdfStorageService, type AlbumExport } from "@/lib/pdf-storage-service";

export function CloudAlbumsViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [cloudAlbums, setCloudAlbums] = useState<AlbumExport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCloudAlbums();
    }
  }, [isOpen]);

  const loadCloudAlbums = async () => {
    setIsLoading(true);
    try {
      const albums = await pdfStorageService.listUserPDFs();
      setCloudAlbums(albums);
    } catch (error) {
      console.error("Erro ao carregar álbuns da nuvem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (album: AlbumExport) => {
    setDownloadingId(album.id);
    try {
      const url = await pdfStorageService.getDownloadURL(album.storagePath);
      if (!url) {
        alert("Erro ao gerar link de download");
        return;
      }

      // Abrir em nova aba ou fazer download direto
      const a = document.createElement("a");
      a.href = url;
      a.download = `album-${album.albumId}.pdf`;
      a.click();
    } catch (error) {
      console.error("Erro ao baixar álbum:", error);
      alert("Erro ao baixar o álbum da nuvem");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-transparent"
      >
        <Cloud className="w-4 h-4" />
        Meus Álbuns na Nuvem
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Cloud className="w-5 h-5 text-primary" />
              Álbuns Salvos na Nuvem
            </DialogTitle>
            <DialogDescription>
              Acesse seus álbuns exportados de qualquer dispositivo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Carregando seus álbuns...
                </p>
              </div>
            ) : cloudAlbums.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Cloud className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                <p className="text-lg text-muted-foreground">
                  Nenhum álbum salvo na nuvem ainda
                </p>
                <p className="text-sm text-muted-foreground">
                  Exporte um álbum e marque a opção &quot;Salvar cópia na
                  nuvem&quot;
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cloudAlbums.map((album) => (
                  <div
                    key={album.id}
                    className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <h4 className="font-semibold">
                            Álbum {album.albumId.slice(-8)}
                          </h4>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Criado:{" "}
                              {album.createdAt.toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Atualizado:{" "}
                              {album.updatedAt.toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <div>
                            <span>
                              Tamanho: {formatFileSize(album.sizeBytes)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleDownload(album)}
                        disabled={downloadingId === album.id}
                        className="gap-2"
                      >
                        {downloadingId === album.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Baixando...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

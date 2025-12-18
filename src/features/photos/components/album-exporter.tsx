"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookOpen, Download, Loader2, Cloud, CloudOff } from "lucide-react";
import type { Photo } from "./photo-gallery";
import { jsPDF } from "jspdf";
import { db } from "@/lib/db";
import { pdfStorageService } from "@/lib/pdf-storage-service";

interface AlbumExporterProps {
  photos: Photo[];
  albumName: string;
  albumId: string;
}

export function AlbumExporter({
  photos,
  albumName,
  albumId,
}: AlbumExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadToCloud, setUploadToCloud] = useState(false);
  const [hasCloudVersion, setHasCloudVersion] = useState(false);

  useEffect(() => {
    const checkCloudVersion = async () => {
      const hasRemote = await pdfStorageService.hasRemoteVersion(albumId);
      setHasCloudVersion(hasRemote);
    };

    checkCloudVersion();
  }, [albumId]);

  const handleExport = async () => {
    if (photos.length === 0) return;

    setIsExporting(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [200, 200],
      });

      let isFirstPage = true;

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];

        if (!isFirstPage) {
          pdf.addPage([200, 200]);
        }
        isFirstPage = false;

        try {
          const localPhoto = await db.photos.get(photo.id);
          if (!localPhoto) continue;

          const imgData = await blobToDataURL(localPhoto.blob);
          const maxSize = 180;
          const margin = 10;

          pdf.addImage(
            imgData,
            "JPEG",
            margin,
            margin,
            maxSize,
            maxSize,
            undefined,
            "FAST"
          );
        } catch (error) {
          console.error("Erro ao adicionar foto:", error);
        }
      }

      const pdfBlob = pdf.output("blob");

      if (uploadToCloud) {
        const uploaded = await pdfStorageService.uploadPDF(
          albumId,
          albumName,
          pdfBlob
        );
        if (uploaded) {
          console.log("PDF enviado para a nuvem com sucesso");
          setHasCloudVersion(true);
        } else {
          alert(
            "Erro ao enviar PDF para a nuvem. O download local continuará normalmente."
          );
        }
      } else if (hasCloudVersion) {
        await pdfStorageService.autoUploadIfExists(albumId, albumName, pdfBlob);
      }

      pdf.save(`${albumName}-album-20x20cm.pdf`);

      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao exportar o álbum. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 hover:scale-105 transition-all bg-transparent"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar Álbum Físico</span>
          <span className="sm:hidden">Exportar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Exportar Álbum Físico
          </DialogTitle>
          <DialogDescription>
            Prepare suas fotos para impressão em um lindo fotolivro de viagem
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Formato Padrão</h4>
                <p className="text-sm text-muted-foreground">
                  Quadrado 20 x 20 cm
                </p>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium">
                  Fotolivro de viagem clássico
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dimensões:</span>
                <span className="font-medium">20cm x 20cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fotos:</span>
                <span className="font-medium">{photos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Páginas:</span>
                <span className="font-medium">{photos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Acabamento:</span>
                <span className="font-medium">Capa dura</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Formato:</span>
                <span className="font-medium">PDF</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-sm text-foreground">
              <strong>Incluído:</strong> Papel fotográfico premium, capa dura
              personalizada e layout profissional otimizado para suas memórias
              de viagem.
            </p>
          </div>

          <div className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="cloud-backup"
                checked={uploadToCloud}
                onChange={(e) => setUploadToCloud(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="cloud-backup" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  {hasCloudVersion ? (
                    <Cloud className="w-4 h-4 text-blue-500" />
                  ) : (
                    <CloudOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="font-semibold text-sm">
                    {hasCloudVersion
                      ? "Atualizar versão na nuvem"
                      : "Salvar cópia na nuvem"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {hasCloudVersion
                    ? "Este álbum já possui uma versão salva. Marque para atualizar."
                    : "Guarde uma cópia segura do seu álbum na nuvem (recurso premium futuro)"}
                </p>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isExporting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || photos.length === 0}
            className="gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exportar em PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

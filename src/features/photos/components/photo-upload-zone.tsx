"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Photo } from "./photo-gallery";
import imageCompression from "browser-image-compression";
import { db } from "@/lib/db";

interface PhotoUploadZoneProps {
  onPhotosUploaded: (photos: Photo[]) => void;
}

export function PhotoUploadZone({ onPhotosUploaded }: PhotoUploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);

      try {
        const newPhotos: Photo[] = await Promise.all(
          acceptedFiles.map(async (file) => {
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
              fileType: file.type,
              initialQuality: 0.85,
            };

            console.log(`Comprimindo imagem ${file.name}...`);
            console.log(
              `Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)}MB`
            );

            const compressedFile = await imageCompression(file, options);

            console.log(
              `Tamanho comprimido: ${(
                compressedFile.size /
                1024 /
                1024
              ).toFixed(2)}MB`
            );
            console.log(
              `Redução: ${(
                ((file.size - compressedFile.size) / file.size) *
                100
              ).toFixed(1)}%`
            );

            // Gerar ID único
            const photoId = `photo-${Date.now()}-${Math.random()
              .toString(36)
              .substring(7)}`;

            // Salvar no IndexedDB
            await db.photos.add({
              id: photoId,
              blob: compressedFile,
              name: file.name,
              size: compressedFile.size,
              uploadedAt: new Date(),
            });

            // Criar URL temporária do blob para exibição
            const blobUrl = URL.createObjectURL(compressedFile);

            return {
              id: photoId,
              url: blobUrl,
              name: file.name,
              size: compressedFile.size,
              uploadedAt: new Date(),
            };
          })
        );

        onPhotosUploaded(newPhotos);
      } catch (error) {
        console.error("Erro ao processar upload:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [onPhotosUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group",
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-muted/50",
        isUploading && "pointer-events-none opacity-75"
      )}
    >
      <input {...getInputProps()} />

      <div className="p-12 md:p-16 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className={cn(
              "w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center transition-transform duration-300",
              isDragActive && "scale-110 bg-primary/20",
              "group-hover:scale-105"
            )}
          >
            {isUploading ? (
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-10 h-10 text-primary" />
            )}
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-foreground">
            {isDragActive
              ? "Solte suas fotos aqui! 📸"
              : isUploading
              ? "Enviando suas fotos..."
              : "Arraste suas fotos aqui"}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            ou clique para selecionar arquivos do seu dispositivo
          </p>
        </div>

        {/* Supported formats */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          <span>PNG, JPG, GIF, WEBP</span>
        </div>
      </div>

      {/* Animated background effect */}
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300",
          isDragActive && "opacity-100"
        )}
      />
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Photo } from "./photo-gallery";
import { createClient } from "@/lib/supabase/client";

interface PhotoUploadZoneProps {
  onPhotosUploaded: (photos: Photo[]) => void;
}

export function PhotoUploadZone({ onPhotosUploaded }: PhotoUploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          console.error("Usuário não autenticado");
          setIsUploading(false);
          return;
        }

        const newPhotos: Photo[] = await Promise.all(
          acceptedFiles.map(async (file) => {
            // Gerar nome único para o arquivo
            const fileExt = file.name.split(".").pop();
            const fileName = `${user.id}/${Date.now()}-${Math.random()
              .toString(36)
              .substring(7)}.${fileExt}`;

            // Upload para o Supabase Storage
            const { data, error } = await supabase.storage
              .from("photos")
              .upload(fileName, file);

            if (error) {
              console.error("Erro ao fazer upload:", error);
              throw error;
            }

            const { data: signed } = await supabase.storage
              .from("photos")
              .createSignedUrl(data.path, 60 * 60 * 24 * 365); // 1 year

            const url = signed?.signedUrl ?? "";
            const id = Math.random().toString(36).substring(7); // ID temporário, será substituído ao salvar no banco
            console.log({ id });

            return {
              id,
              url,
              name: file.name,
              size: file.size,
              uploadedAt: new Date(),
              userId: user.id,
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
    [onPhotosUploaded, supabase]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".heic"],
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
            ou clique para selecionar arquivos do seu computador
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

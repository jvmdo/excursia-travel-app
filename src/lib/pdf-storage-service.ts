import { createClient } from "./supabase/client";

export interface AlbumExport {
  id: string;
  userId: string;
  albumId: string;
  storagePath: string;
  sizeBytes: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PDFStorageService {
  private supabase = createClient();

  private async getUserId() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    return user?.id;
  }

  // Upload manual de PDF para o Supabase
  async uploadPDF(
    albumId: string,
    albumName: string,
    pdfBlob: Blob
  ): Promise<string | null> {
    try {
      const userId = await this.getUserId();

      if (!userId) {
        console.error("User not found");
        return null;
      }

      const storagePath = `${userId}/${albumId}.pdf`;

      // Upload para o bucket album-pdfs (overwrite se já existir)
      const { error: uploadError } = await this.supabase.storage
        .from("album-pdfs")
        .upload(storagePath, pdfBlob, {
          contentType: "application/pdf",
          upsert: true, // Permite overwrite
        });

      if (uploadError) {
        console.error("Erro ao fazer upload do PDF:", uploadError);
        return null;
      }

      // UPSERT em album_exports
      const { error: dbError } = await this.supabase
        .from("album_exports")
        .upsert(
          {
            user_id: userId,
            album_id: albumId,
            storage_path: storagePath,
            size_bytes: pdfBlob.size,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,album_id",
          }
        )
        .select();

      if (dbError) {
        console.error("Erro ao salvar metadados do PDF:", dbError);
        return null;
      }

      console.log("PDF enviado com sucesso:", storagePath);
      return storagePath;
    } catch (error) {
      console.error("Erro inesperado ao fazer upload do PDF:", error);
      return null;
    }
  }

  // Verificar se álbum já possui versão remota
  async hasRemoteVersion(albumId: string): Promise<boolean> {
    const userId = await this.getUserId();

    if (!userId) {
      console.error("User not found");
      return false;
    }

    try {
      const { data, error } = await this.supabase
        .from("album_exports")
        .select("id")
        .eq("user_id", userId)
        .eq("album_id", albumId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao verificar versão remota:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Erro inesperado ao verificar versão remota:", error);
      return false;
    }
  }

  // Upload automático (apenas se já existir versão remota)
  async autoUploadIfExists(
    albumId: string,
    albumName: string,
    pdfBlob: Blob
  ): Promise<boolean> {
    try {
      const hasRemote = await this.hasRemoteVersion(albumId);

      if (!hasRemote) {
        console.log(
          "Álbum não possui versão remota, pulando upload automático"
        );
        return false;
      }

      const result = await this.uploadPDF(albumId, albumName, pdfBlob);
      return !!result;
    } catch (error) {
      console.error("Erro no upload automático:", error);
      return false;
    }
  }

  // Listar PDFs remotos do usuário
  async listUserPDFs(): Promise<AlbumExport[]> {
    const userId = await this.getUserId();

    if (!userId) {
      console.error("User not found");
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from("album_exports")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao listar PDFs:", error);
        return [];
      }

      return (data || []).map((item) => ({
        id: item.id,
        userId: item.user_id,
        albumId: item.album_id,
        storagePath: item.storage_path,
        sizeBytes: item.size_bytes || 0,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));
    } catch (error) {
      console.error("Erro inesperado ao listar PDFs:", error);
      return [];
    }
  }

  // Gerar signed URL para download
  async getDownloadURL(
    storagePath: string,
    expiresIn = 3600
  ): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.storage
        .from("album-pdfs")
        .createSignedUrl(storagePath, expiresIn);

      if (error) {
        console.error("Erro ao gerar URL de download:", error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error("Erro inesperado ao gerar URL de download:", error);
      return null;
    }
  }

  // Download de PDF remoto
  async downloadPDF(storagePath: string): Promise<Blob | null> {
    try {
      const { data, error } = await this.supabase.storage
        .from("album-pdfs")
        .download(storagePath);

      if (error) {
        console.error("Erro ao baixar PDF:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Erro inesperado ao baixar PDF:", error);
      return null;
    }
  }

  // Deletar PDF remoto
  async deletePDF(albumId: string): Promise<boolean> {
    const userId = await this.getUserId();

    if (!userId) {
      console.error("User not found");
      return false;
    }

    try {
      const storagePath = `${userId}/${albumId}.pdf`;

      // Deletar do storage
      const { error: storageError } = await this.supabase.storage
        .from("album-pdfs")
        .remove([storagePath]);

      if (storageError) {
        console.error("Erro ao deletar PDF do storage:", storageError);
        return false;
      }

      // Deletar metadados
      const { error: dbError } = await this.supabase
        .from("album_exports")
        .delete()
        .eq("user_id", userId)
        .eq("album_id", albumId);

      if (dbError) {
        console.error("Erro ao deletar metadados do PDF:", dbError);
        return false;
      }

      console.log("PDF deletado com sucesso:", storagePath);
      return true;
    } catch (error) {
      console.error("Erro inesperado ao deletar PDF:", error);
      return false;
    }
  }
}

export const pdfStorageService = new PDFStorageService();

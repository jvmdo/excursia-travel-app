"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, Download, Loader2 } from "lucide-react"
import type { Photo } from "./photo-gallery"
import { jsPDF } from "jspdf"

interface AlbumExporterProps {
  photos: Photo[]
  albumName: string
}

export function AlbumExporter({ photos, albumName }: AlbumExporterProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleExport = async () => {
    if (photos.length === 0) return

    setIsExporting(true)

    try {
      // Criar PDF no formato 20x20cm (200x200mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [200, 200], // 20cm x 20cm
      })

      let isFirstPage = true

      // Adicionar cada foto em uma página
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]

        if (!isFirstPage) {
          pdf.addPage([200, 200])
        }
        isFirstPage = false

        // Carregar imagem
        try {
          const imgData = await loadImage(photo.url)

          // Calcular dimensões mantendo aspect ratio
          const maxSize = 180 // mm (deixando margem de 10mm)
          const margin = 10

          pdf.addImage(imgData, "JPEG", margin, margin, maxSize, maxSize, undefined, "FAST")
        } catch (error) {
          console.error("Erro ao adicionar foto:", error)
        }
      }

      // Salvar PDF
      pdf.save(`${albumName}-album-20x20cm.pdf`)

      setIsOpen(false)
    } catch (error) {
      console.error("Erro ao exportar PDF:", error)
      alert("Erro ao exportar o álbum. Tente novamente.")
    } finally {
      setIsExporting(false)
    }
  }

  // Função auxiliar para carregar imagem
  const loadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL("image/jpeg", 0.8))
        } else {
          reject(new Error("Não foi possível criar contexto do canvas"))
        }
      }
      img.onerror = reject
      img.src = url
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 hover:scale-105 transition-all bg-transparent">
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
          <DialogDescription>Prepare suas fotos para impressão em um lindo fotolivro de viagem</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Formato Padrão</h4>
                <p className="text-sm text-muted-foreground">Quadrado 20 x 20 cm</p>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium">Fotolivro de viagem clássico</span>
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
              <strong>Incluído:</strong> Papel fotográfico premium, capa dura personalizada e layout profissional
              otimizado para suas memórias de viagem.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isExporting}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={isExporting || photos.length === 0} className="gap-2">
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
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false)
    }

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowInstructions(true)
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setIsInstallable(false)
    }
  }

  if (!isInstallable && !showInstructions) {
    return null
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-20 right-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg hover:scale-105 transition-all"
        >
          <span className="mr-2">📲</span>
          Instalar App
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📱</span>
            <div>
              <h4 className="font-semibold">Instalar Travelapp</h4>
              <p className="text-xs text-muted-foreground">Acesse rapidamente do seu dispositivo</p>
            </div>
          </div>

          {isInstallable ? (
            <>
              <p className="text-sm">
                Adicione o Travelapp à sua tela inicial para acesso rápido e experiência completa, mesmo offline!
              </p>
              <Button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 transition-all"
              >
                Instalar Agora
              </Button>
            </>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="font-medium">Como instalar:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <strong>Chrome/Edge:</strong> Menu (⋮) → "Instalar app"
                </p>
                <p>
                  <strong>Safari iOS:</strong> Compartilhar → "Adicionar à Tela de Início"
                </p>
                <p>
                  <strong>Safari Mac:</strong> Arquivo → "Adicionar ao Dock"
                </p>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

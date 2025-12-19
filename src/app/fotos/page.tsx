import { PhotoGallery } from "@/features/photos/components/photo-gallery";
import { ImageIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <ImageIcon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-display text-foreground">
              Excursia
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <SidebarTrigger />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 md:px-4 py-6 md:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <div className="text-center space-y-3 md:space-y-4 animate-slide-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-display text-balance leading-tight">
              Suas fotos <span className="text-primary">lindamente</span>{" "}
              organizadas
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-2">
              Organize suas fotos em álbuns de forma simples e intuitiva.
              Exporte em PDF para impressão e salve em nuvem se quiser acessar
              de outros dispositivos.
            </p>
          </div>

          <PhotoGallery />
        </div>
      </main>

      <footer className="border-t border-border mt-12 md:mt-16 py-6 md:py-8">
        <div className="container mx-auto px-3 md:px-4 text-center space-y-2">
          <p className="text-base md:text-lg font-semibold text-foreground">
            Powered by Excursia Viagens
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            © 2025 Excursia. Feito com amor para suas memórias.
          </p>
        </div>
      </footer>
    </div>
  );
}

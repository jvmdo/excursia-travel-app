import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-sky-500 via-cyan-400 to-purple-400 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center max-w-2xl">
        <div className="text-7xl mb-4 animate-float">🌍</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Travelapp by Excursia Viagens
        </h1>
        <p className="text-lg md:text-xl opacity-95 mb-8">
          Crie roteiros personalizados com inteligência artificial
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-sky-600 hover:bg-white/90 font-semibold"
          >
            <Link href="/auth/login">Entrar</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent border-white font-semibold hover:bg-white/10"
          >
            <Link href="/auth/sign-up" className="hover:text-white">
              Criar Conta
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

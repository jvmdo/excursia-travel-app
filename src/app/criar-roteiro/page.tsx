import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { ItineraryContainer } from "@/features/itinerary/itinerary-container";
import ChatWidgetContainer from "@/features/chat/chat-widget-container";
import { ConfirmLogoutDialog } from "@/components/confirm-logout-dialog";

export default async function AppPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-orange-50">
      <header className="bg-linear-to-r from-sky-500 via-cyan-400 to-purple-400 text-white py-8 px-4 text-center relative">
        <div className="absolute top-4 right-4">
          <ConfirmLogoutDialog />
        </div>

        <div className="text-5xl mb-2 inline-block animate-float">🌍</div>
        <h1 className="text-3xl font-bold mb-1 drop-shadow-lg">
          Travelapp by Excursia Viagens
        </h1>
        <p className="drop-shadow-lg">
          ✨ Crie roteiros personalizados com inteligência artificial
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 -mt-4 relative z-10">
        <ItineraryContainer />
      </main>

      <ChatWidgetContainer />
    </div>
  );
}

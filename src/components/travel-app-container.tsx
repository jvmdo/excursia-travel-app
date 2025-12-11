"use client";

import { ItineraryContainer } from "@/features/itinerary/itinerary-container";
import { AuthContainer } from "@/features/auth/auth-container";
import ChatWidgetContainer from "@/features/chat/chat-widget-container";

// TODO: Move whole JSX to page
function TravelAppContainer() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-orange-50">
      <header className="bg-linear-to-r from-sky-500 via-cyan-400 to-purple-400 text-white py-8 px-4 text-center relative">
        <div className="absolute top-4 right-4">
          <AuthContainer />
        </div>

        <div className="text-5xl mb-2 inline-block animate-bounce">🌍</div>
        <h1 className="text-3xl font-bold mb-1 drop-shadow-[0_0.5px_0.5px_rgba(0,0,0,0.8)]">
          Travelapp by Excursia Viagens
        </h1>
        <p className="drop-shadow-[0_0.25px_0.25px_rgba(0,0,0,0.8)]">
          ✨ Crie roteiros personalizados com inteligência artificial
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 -mt-4 relative z-10">
        <ItineraryContainer />
      </main>

      <ChatWidgetContainer />
      {/* <PWAInstallButton /> */}
    </div>
  );
}

export default TravelAppContainer;

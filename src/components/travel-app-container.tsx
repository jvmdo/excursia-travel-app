"use client";

import React from "react";

import { PWAInstallButton } from "@/components/pwa-install-button";
import { Toaster } from "@/components/ui/toaster";
import { ItineraryFeature } from "@/features/itinerary/containers/itinerary-feature";
import { ChatFeature } from "@/features/chat/containers/chat-feature";
import { AuthFeature } from "@/features/auth/containers/auth-feature";

function TravelAppContainer() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-orange-50">
      <header className="bg-linear-to-r from-sky-500 via-cyan-400 to-orange-400 text-white py-8 px-4 text-center relative">
        <div className="absolute top-4 right-4">
          <AuthFeature />
        </div>

        <div className="text-5xl mb-2 inline-block animate-bounce">🌍</div>
        <h1 className="text-3xl font-bold mb-1">
          Travelapp by Excursia Viagens
        </h1>
        <p className="opacity-95">
          ✨ Crie roteiros personalizados com inteligência artificial
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 -mt-4 relative z-10">
        <ItineraryFeature />
      </main>

      <ChatFeature />
      <Toaster />
      {/* <PWAInstallButton /> */}
    </div>
  );
}

export default TravelAppContainer;

"use client";

import { useRef } from "react";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User } from "@supabase/supabase-js";
import { markdownToHtml, parseItinerary } from "@/lib/markdown-to-html";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/toaster";
import { ItineraryCardDisplay } from "./itinerary-card-display";
import { PWAInstallButton } from "./pwa-install-button";
import { ChatTooltip } from "./chat-tooltip";

interface ItineraryItem {
  destino: string;
  dias: number;
  html: string;
  data: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface TravelAppProps {
  user: User;
}

const templates = [
  {
    icon: "⛰️",
    label: "Aventura",
    value: "Aventura, trilhas e paisagens naturais",
  },
  {
    icon: "🏛️",
    label: "Cultura",
    value: "Museus, história e gastronomia local",
  },
  { icon: "🏖️", label: "Praia", value: "Praias, relaxamento e vida noturna" },
  {
    icon: "💸",
    label: "Low Cost",
    value: "Viagem econômica, passeios gratuitos e transporte barato",
  },
];

export function TravelApp({ user }: TravelAppProps) {
  const supabase = createClient();

  const [destino, setDestino] = useState("");
  const [dias, setDias] = useState("");
  const [preferencias, setPreferencias] = useState("aventura");
  const [resultado, setResultado] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [salvos, setSalvos] = useState<ItineraryItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(
    null
  );
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [currentDestino, setCurrentDestino] = useState("");

  const resultRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("roteiros");
    if (saved) setSalvos(JSON.parse(saved));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Até logo!",
      description: "Você foi desconectado com sucesso.",
    });
    window.location.href = "/";
  };

  const usarTemplate = (template: string) => {
    setPreferencias(template);
  };

  const detectarMoeda = (destino: string) => {
    const moedas: { [key: string]: string } = {
      brasil: "BRL",
      "porto rico": "USD",
      argentina: "ARS",
      chile: "CLP",
      colombia: "COP",
      mexico: "MXN",
      peru: "PEN",
      espanha: "EUR",
      italia: "EUR",
      france: "EUR",
      portugal: "EUR",
      "reino unido": "GBP",
      eua: "USD",
      canada: "CAD",
      japao: "JPY",
      tailandia: "THB",
      vietna: "VND",
    };
    for (const [pais, moeda] of Object.entries(moedas)) {
      if (destino.toLowerCase().includes(pais)) return moeda;
    }
    return "USD";
  };

  const formatarRoteiroComTimeline = (
    destino: string,
    dias: number,
    moeda: string,
    texto: string
  ) => {
    if (!texto || typeof texto !== "string") {
      console.log("Invalid texto:", texto);
      return "";
    }

    const parsedDays = parseItinerary(texto);
    console.log("Parsed days:", parsedDays);

    let html = `
      <div class="itinerary-container">
        <div class="itinerary-header">
          <h2 class="destination-title">📍 ${destino}</h2>
          <p class="itinerary-meta">${dias} dias • Gerado em ${new Date().toLocaleDateString(
      "pt-BR"
    )} • Valores em ${moeda}</p>
        </div>
        <div class="days-grid">
    `;

    parsedDays.forEach((day, index) => {
      html += `
        <div class="day-card-modern" style="animation-delay: ${index * 0.1}s">
          <div class="card-corner-decoration">✨</div>
          <div class="day-badge">
            <span class="day-emoji">📅</span>
            <span class="day-number">Dia ${day.day}</span>
          </div>
          <div class="day-title-section">
            <h3 class="day-title-enhanced">${markdownToHtml(day.title)}</h3>
          </div>
          <div class="day-content-enhanced">
            ${day.content}
          </div>
          <div class="card-footer-decoration">
            <span>🌟</span>
            <span>🗺️</span>
            <span>✈️</span>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    return html;
  };

  const gerarRoteiro = async () => {
    if (!destino || !dias) {
      toast({
        title: "⚠️ Campos obrigatórios",
        description: "Por favor, preencha o destino e o número de dias.",
        variant: "destructive",
      });
      return;
    }

    const diasNum = Number.parseInt(dias);
    if (diasNum < 1 || diasNum > 30) {
      toast({
        title: "⚠️ Número de dias inválido",
        description: "O número de dias deve estar entre 1 e 30.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResultado("");
    const moeda = detectarMoeda(destino);
    const estilo = preferencias;

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destino, dias: diasNum, moeda, estilo }),
      });

      if (!response.ok) throw new Error("Erro ao gerar roteiro");

      const data = await response.json();

      const roteiroComTimeline = formatarRoteiroComTimeline(
        destino,
        diasNum,
        moeda,
        data.texto
      );

      setResultado(roteiroComTimeline);
      setCurrentDestino(destino);

      // Save to localStorage
      const novoRoteiro: ItineraryItem = {
        destino,
        dias: diasNum,
        html: roteiroComTimeline,
        data: new Date().toISOString(),
      };
      const updated = [novoRoteiro, ...salvos].slice(0, 10);
      setSalvos(updated);
      localStorage.setItem("roteiros", JSON.stringify(updated));

      toast({
        title: "✨ Roteiro gerado!",
        description: `Seu itinerário para ${destino} foi criado com sucesso.`,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "❌ Erro ao gerar roteiro",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deletarRoteiro = (index: number) => {
    setDeleteConfirmIndex(index);
  };

  const confirmarDeletar = () => {
    if (deleteConfirmIndex !== null) {
      const updated = salvos.filter((_, i) => i !== deleteConfirmIndex);
      setSalvos(updated);
      localStorage.setItem("roteiros", JSON.stringify(updated));
      toast({
        title: "🗑️ Roteiro deletado",
        description: "O itinerário foi removido com sucesso.",
      });
      setDeleteConfirmIndex(null);
    }
  };

  const carregarRoteiro = (roteiro: ItineraryItem) => {
    setResultado(roteiro.html);
    setCurrentDestino(roteiro.destino);
    toast({
      title: "📂 Roteiro carregado",
      description: `Exibindo itinerário para ${roteiro.destino}.`,
    });
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const enviarMensagemChat = async () => {
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();

    const userMessage: ChatMessage = { role: "user", content: userText };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat-travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: chatMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || "Erro no chat");
      }

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.mensagem },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "❌ Erro no chat",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desculpe, ocorreu um erro. Tente novamente.",
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const gerarPDF = () => {
    if (!resultado) {
      toast({
        title: "⚠️ Nenhum roteiro disponível",
        description: "Gere um roteiro primeiro para fazer o download em PDF.",
        variant: "destructive",
      });
      return;
    }
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = resultado;

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background: #f8f9fa; }
              .itinerary-container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
              .itinerary-header { text-align: center; padding-bottom: 30px; border-bottom: 3px solid #0ea5e9; margin-bottom: 30px; }
              .destination-title { font-size: 32px; margin-bottom: 10px; color: #0ea5e9; font-weight: 700; }
              .itinerary-meta { font-size: 14px; color: #64748b; }
              .days-grid { display: grid; gap: 20px; }
              .day-card-modern { 
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); 
                border: 2px solid #0ea5e9; 
                border-radius: 12px; 
                padding: 20px; 
                box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
                page-break-inside: avoid;
              }
              .day-badge { 
                display: inline-flex; 
                align-items: center; 
                gap: 8px; 
                background: #0ea5e9; 
                color: white; 
                padding: 8px 16px; 
                border-radius: 20px; 
                font-weight: 600; 
                margin-bottom: 15px;
              }
              .day-title-enhanced { font-size: 20px; font-weight: 600; color: #0c4a6e; margin-bottom: 15px; }
              .day-content-enhanced { font-size: 14px; line-height: 1.8; color: #334155; }
              .day-content-enhanced p { margin: 10px 0; }
              .day-content-enhanced strong { color: #0ea5e9; font-weight: 600; }
            </style>
          </head>
          <body>${resultado}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      toast({
        title: "📄 PDF aberto",
        description: "Use a opção de impressão para salvar o arquivo.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-orange-50">
      <Toaster />
      <PWAInstallButton />

      {/* Header */}
      <header className="bg-gradient-to-r from-sky-500 via-cyan-400 to-orange-400 text-white py-8 px-4 text-center relative">
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLogoutConfirmOpen(true)}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all hover:scale-105"
          >
            👋 Sair
          </Button>
        </div>
        <div className="text-5xl mb-2 inline-block animate-bounce">🌍</div>
        <h1 className="text-3xl font-bold mb-1">
          Travelapp by Excursia Viagens
        </h1>
        <p className="opacity-95">
          ✨ Crie roteiros personalizados com inteligência artificial
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 -mt-4 relative z-10">
        {/* Templates */}
        <Card className="mb-6 shadow-lg transition-all hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>🎯</span> Templates de Viagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templates.map((template) => (
                <button
                  key={template.label}
                  onClick={() => usarTemplate(template.value)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-border bg-card hover:bg-accent hover:border-sky-400 transition-all hover:scale-105 duration-200"
                >
                  <span className="text-3xl animate-pulse">
                    {template.icon}
                  </span>
                  <span className="text-sm font-medium">{template.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="mb-6 shadow-lg transition-all hover:shadow-xl">
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                ✈️
              </span>
              <Input
                placeholder="Destino"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="pl-10 transition-all focus:scale-[1.01]"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                📅
              </span>
              <Input
                type="number"
                placeholder="Dias de viagem"
                min={1}
                max={30}
                value={dias}
                onChange={(e) => setDias(e.target.value)}
                className="pl-10 transition-all focus:scale-[1.01]"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-3 text-lg">🧭</span>
              <Textarea
                placeholder="Preferências"
                value={preferencias}
                onChange={(e) => setPreferencias(e.target.value)}
                maxLength={500}
                className="pl-10 min-h-24 transition-all focus:scale-[1.01]"
              />
              <div className="text-xs text-muted-foreground text-right mt-1">
                {preferencias.length}/500
              </div>
            </div>

            <Button
              onClick={gerarRoteiro}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white font-semibold py-6 transition-all hover:scale-[1.02]"
            >
              {isLoading
                ? "⏳ Gerando roteiro..."
                : "✨ Gerar Roteiro Completo"}
            </Button>
          </CardContent>
        </Card>

        {/* Loading */}
        {isLoading && (
          <Card className="mb-6 shadow-lg animate-in fade-in zoom-in duration-300">
            <CardContent className="py-12 flex flex-col items-center gap-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-sky-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-sky-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-center text-muted-foreground">
                🎨 Gerando seu roteiro detalhado para {destino}...
              </p>
              <div className="w-full max-w-xs h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-500 to-orange-400 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {resultado && (
          <div ref={resultRef}>
            <ItineraryCardDisplay
              resultado={resultado}
              destino={currentDestino}
              onGeneratePDF={gerarPDF}
            />
          </div>
        )}

        {/* Saved Itineraries */}
        {salvos.length > 0 && (
          <Card className="shadow-lg transition-all hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>💾</span> Roteiros Salvos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {salvos.map((roteiro, index) => (
                  <div
                    key={index}
                    className="p-4 border-2 border-border rounded-lg hover:bg-accent cursor-pointer transition-all hover:scale-105 hover:border-sky-400 duration-200"
                    onClick={() => carregarRoteiro(roteiro)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold flex items-center gap-1">
                        🗺️ {roteiro.destino}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletarRoteiro(index);
                        }}
                        className="text-orange-500 hover:text-orange-600 text-xl hover:scale-125 transition-all"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      📅 {roteiro.dias} dias •{" "}
                      {new Date(roteiro.data).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chat Widget */}
      <Popover open={isChatOpen} onOpenChange={setIsChatOpen}>
        <ChatTooltip>
          <PopoverTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-2xl p-0 transition-all hover:scale-110 animate-bounce"
              title="Assistente de Viagens"
            >
              💬
            </Button>
          </PopoverTrigger>
        </ChatTooltip>
        <PopoverContent
          className="w-96 p-0 shadow-xl mb-2 mr-2 animate-in slide-in-from-bottom-5 duration-300"
          align="end"
        >
          <div className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <span>🤖</span> Assistente de Viagens
            </h3>
            <p className="text-xs opacity-90">
              ✨ Faça perguntas sobre destinos e viagens
            </p>
          </div>

          <ScrollArea className="h-80 p-4 flex flex-col gap-3">
            {chatMessages.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8 animate-in fade-in duration-500">
                👋 Olá! Como posso ajudar com suas viagens?
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-in slide-in-from-bottom-3 duration-300`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm transition-all hover:scale-[1.02] ${
                    msg.role === "user"
                      ? "bg-sky-500 text-white"
                      : "bg-border text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-border text-foreground px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-3 gap-2 flex">
            <input
              type="text"
              placeholder="💭 Digite sua pergunta..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && enviarMensagemChat()}
              className="flex-1 px-3 py-2 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
            <Button
              size="sm"
              onClick={enviarMensagemChat}
              disabled={isChatLoading || !chatInput.trim()}
              className="rounded-full px-3 transition-all hover:scale-110"
            >
              ➤
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirmIndex !== null}
        onOpenChange={(open) => !open && setDeleteConfirmIndex(null)}
      >
        <AlertDialogContent className="animate-in zoom-in duration-300">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span>🗑️</span> Deletar roteiro?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O roteiro será removido
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="transition-all hover:scale-105">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarDeletar}
              className="bg-red-600 hover:bg-red-700 transition-all hover:scale-105"
            >
              Deletar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <AlertDialogContent className="animate-in zoom-in duration-300">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span>👋</span> Desconectar?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você será desconectado da sua conta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel className="transition-all hover:scale-105">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="transition-all hover:scale-105"
            >
              Desconectar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

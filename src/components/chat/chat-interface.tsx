"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { PawPrint } from "lucide-react";

export function ChatInterface() {
  const { messages, sendMessage, status } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    await sendMessage({ text });
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (isLoading) return;
    await sendMessage({ text: suggestion });
  };

  const handleFileUpload = async (file: File) => {
    setUploadStatus("Subiendo archivo...");
    const formData = new FormData();
    formData.append("file", file);

    const isStock =
      file.name.toLowerCase().includes("stock") ||
      file.name.toLowerCase().includes("inventario");
    formData.append("type", isStock ? "stock" : "sales");

    try {
      const res = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadStatus(null);

      await sendMessage({
        text: `He subido el archivo "${file.name}" (${isStock ? "inventario" : "ventas"}). Resultado: ${data.message || (data.success ? "Importación exitosa" : "Error en la importación")}`,
      });
    } catch {
      setUploadStatus(null);
      await sendMessage({
        text: `Intenté subir "${file.name}" pero hubo un error de conexión.`,
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-10 sm:pt-20 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <PawPrint className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Petshop AI</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Pregunta sobre ventas, inventario, predicciones de demanda o
                sube un archivo Excel para importar datos.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {[
                  "¿Qué productos están en stock crítico?",
                  "Predice ventas de Alimento para 30 días",
                  "¿Cuáles son las marcas más vendidas?",
                  "Genera una orden de compra sugerida",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-lg border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <PawPrint className="h-4 w-4 text-primary" />
                </div>
                <div className="rounded-2xl bg-muted px-4 py-2.5">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-foreground/40" />
                  </div>
                </div>
              </div>
            )}

          {uploadStatus && (
            <div className="text-center text-sm text-muted-foreground">
              {uploadStatus}
            </div>
          )}
        </div>
      </div>

      <ChatInput
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onFileUpload={handleFileUpload}
        isLoading={isLoading}
      />
    </div>
  );
}

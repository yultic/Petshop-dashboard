"use client";

import { useHealth } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { PawPrint } from "lucide-react";

export function ChatHeader() {
  const { data: health, isError } = useHealth();

  return (
    <header className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2">
        <PawPrint className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold">Petshop AI</h1>
      </div>
      <Badge variant={isError ? "destructive" : "secondary"} className="max-w-[140px] truncate sm:max-w-none">
        {isError
          ? "Backend offline"
          : health
            ? `${health.models_loaded} modelos cargados`
            : "Conectando..."}
      </Badge>
    </header>
  );
}

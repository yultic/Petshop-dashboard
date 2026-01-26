"use client";

import { useHealth } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle } from "lucide-react";

export function Header() {
  const { data: health, isLoading } = useHealth();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Análisis y predicciones de ventas
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Health Status */}
          {!isLoading && health && (
            <div className="flex items-center gap-2">
              <Badge
                variant={health.status === "healthy" ? "default" : "destructive"}
                className="gap-1"
              >
                {health.status === "healthy" ? (
                  <Activity className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                {health.status === "healthy" ? "Sistema Activo" : "Sistema Inactivo"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {health.models_loaded} modelos cargados
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

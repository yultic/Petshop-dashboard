"use client";

import { useHealth } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: health, isLoading } = useHealth();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {/* Botón de menú para móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={onMenuClick}
            aria-label="Abrir menú"
          >
            <PanelLeft className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="hidden sm:block text-sm text-muted-foreground">
              Análisis y predicciones de ventas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Health Status */}
          {!isLoading && health && (
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  health.status === "healthy" ? "default" : "destructive"
                }
                className="gap-1"
              >
                {health.status === "healthy" ? (
                  <Activity className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                <span className="hidden sm:inline">
                  {health.status === "healthy"
                    ? "Sistema Activo"
                    : "Sistema Inactivo"}
                </span>
              </Badge>
              <span className="hidden lg:block text-xs text-muted-foreground">
                {health.models_loaded} modelos cargados
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

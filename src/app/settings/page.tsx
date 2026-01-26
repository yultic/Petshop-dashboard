"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useHealth, useModels } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Server,
  Database,
  Cpu,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function SettingsPage() {
  const { data: health, isLoading: loadingHealth } = useHealth();
  const { data: models, isLoading: loadingModels } = useModels();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h1>
        <p className="text-muted-foreground mt-1">
          Estado del sistema, modelos ML y configuración general
        </p>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Estado del Sistema
          </CardTitle>
          <CardDescription>Información de salud de la API</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingHealth ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : health ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado del Sistema</span>
                <Badge variant={health.status === "healthy" ? "default" : "destructive"}>
                  {health.status === "healthy" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {health.status === "healthy" ? "Operativo" : "Fuera de Servicio"}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Versión</p>
                  <p className="text-lg font-semibold">{health.version}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ambiente</p>
                  <p className="text-lg font-semibold">{health.environment}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modelos Cargados</p>
                  <p className="text-lg font-semibold">{health.models_loaded}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="text-lg font-semibold">
                    {(health.uptime_seconds / 3600).toFixed(1)}h
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* ML Models */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Modelos de Machine Learning
          </CardTitle>
          <CardDescription>Modelos XGBoost entrenados y disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingModels ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          ) : models && models.length > 0 ? (
            <div className="space-y-3">
              {models.slice(0, 10).map((model, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{model.model_key}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tipo: {model.model_type}
                      </p>
                      {model.trained_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Entrenado: {new Date(model.trained_at).toLocaleString("es-SV")}
                        </p>
                      )}
                    </div>
                    {model.metrics && (
                      <div className="text-right">
                        <Badge variant="secondary">
                          MAPE: {formatNumber(model.metrics.mape, 2)}%
                        </Badge>
                        {model.metrics.r2_score && (
                          <p className="text-xs text-muted-foreground mt-1">
                            R²: {formatNumber(model.metrics.r2_score, 3)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {models.length > 10 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  Mostrando 10 de {models.length} modelos
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay modelos cargados</p>
          )}
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Configuración de API
          </CardTitle>
          <CardDescription>Endpoints y configuración de conexión</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">URL Base</p>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">
                {process.env.NEXT_PUBLIC_API_URL || "https://petshop-sales-forecasting-production.up.railway.app"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Documentación API</p>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL || "https://petshop-sales-forecasting-production.up.railway.app"}/docs`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline mt-1 inline-block"
              >
                Ver Swagger UI →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Sobre el Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">Versión del Dashboard</p>
              <p className="text-muted-foreground">1.0.0</p>
            </div>

            <div>
              <p className="font-medium">Tecnologías</p>
              <p className="text-muted-foreground">
                Next.js 16.1.4, TypeScript, TailwindCSS, Recharts, TanStack Query
              </p>
            </div>

            <div>
              <p className="font-medium">Backend</p>
              <p className="text-muted-foreground">
                FastAPI, Python, XGBoost, PostgreSQL
              </p>
            </div>

            <div>
              <p className="font-medium">Desarrollado por</p>
              <p className="text-muted-foreground">
                Yultic - Software Development Consultancy
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

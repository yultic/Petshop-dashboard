"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDataStats } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Calendar, Package, TrendingUp } from "lucide-react";
import { formatCurrency, formatNumber, formatDateShort } from "@/lib/utils";

export default function DataPage() {
  const { data: stats, isLoading } = useDataStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Datos Históricos</h1>
        <p className="text-muted-foreground mt-1">
          Información del dataset y estadísticas generales
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : stats ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Registros
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(stats.total_records, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Días con Ventas
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.business_days}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  de {stats.total_days} días totales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Productos Únicos
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.products_count}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  en {stats.categories_count} categorías
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ventas Totales
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.total_sales)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Promedio: {formatCurrency(stats.average_daily_sales)}/día
                </p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Dataset Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Dataset</CardTitle>
          <CardDescription>Detalles del conjunto de datos históricos</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : stats ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Período de Datos</p>
                  <p className="text-lg font-semibold mt-1">
                    {formatDateShort(stats.date_range_start)} - {formatDateShort(stats.date_range_end)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Días Totales</p>
                  <p className="text-lg font-semibold mt-1">
                    {stats.total_days} días ({stats.business_days} hábiles)
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Métricas de Calidad del Dataset
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-green-900">Completitud</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {((stats.business_days / stats.total_days) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-green-700 mt-1">Días con datos</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-900">Densidad</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {formatNumber(stats.total_records / stats.business_days, 0)}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">Registros/día promedio</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-purple-900">Diversidad</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">
                      {stats.categories_count}
                    </p>
                    <p className="text-xs text-purple-700 mt-1">Categorías únicas</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Nota:</strong> Este dataset se actualiza automáticamente cuando subes nuevos archivos Excel.
                  Los modelos ML se reentrenan en background para mantener las predicciones actualizadas.
                </p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre los Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">Fuente de Datos</p>
              <p className="text-muted-foreground">
                Datos históricos de ventas del Petshop procesados desde archivos Excel.
              </p>
            </div>

            <div>
              <p className="font-medium">Actualización</p>
              <p className="text-muted-foreground">
                El dataset se actualiza mediante la página de Upload. Los nuevos datos se procesan,
                limpian y deduplicadican automáticamente antes de agregarse al conjunto histórico.
              </p>
            </div>

            <div>
              <p className="font-medium">Exclusiones</p>
              <p className="text-muted-foreground">
                Los domingos están excluidos del dataset ya que el petshop está cerrado.
                Solo se procesan días hábiles (lunes a sábado).
              </p>
            </div>

            <div>
              <p className="font-medium">Modelos ML</p>
              <p className="text-muted-foreground">
                Los modelos XGBoost se entrenan con este dataset y se actualizan automáticamente
                cuando se agregan nuevos datos significativos ({">"} 50 registros).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

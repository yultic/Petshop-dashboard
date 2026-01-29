"use client";

import { KPICard } from "@/components/dashboard/kpi-card";
import { SalesForecastChart } from "@/components/charts/sales-forecast-chart";
import { StockAlertsTable } from "@/components/dashboard/stock-alerts-table";
import { QueryError } from "@/components/query-error";
import {
  usePredict,
  useCriticalStockAlerts,
  useStockSummary,
} from "@/hooks/use-api";
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const {
    data: predictions,
    isLoading: loadingPredictions,
    isError: errorPredictions,
    refetch: refetchPredictions,
  } = usePredict("categoria", "Alimento", 30);

  const {
    data: criticalAlerts,
    isLoading: loadingAlerts,
    isError: errorAlerts,
    refetch: refetchAlerts,
  } = useCriticalStockAlerts(30);

  const {
    data: stockSummary,
    isLoading: loadingStock,
    isError: errorStock,
    refetch: refetchStock,
  } = useStockSummary(30);

  const totalPredictedSales = predictions?.total || 0;
  const avgDailySales = predictions && predictions.days > 0 ? totalPredictedSales / predictions.days : 0;
  const next7DaysSales =
    predictions?.predictions
      ?.slice(0, 7)
      .reduce((sum, p) => sum + (p.predicted_sales || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard General</h1>
        <p className="text-muted-foreground mt-1">
          Resumen ejecutivo de predicciones y estado del inventario.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Ventas Proyectadas (30d)"
          value={totalPredictedSales}
          format="currency"
          decimals={0}
          icon={DollarSign}
          loading={loadingPredictions}
        />
        <KPICard
          title="Promedio Diario"
          value={avgDailySales}
          format="currency"
          decimals={0}
          icon={TrendingUp}
          loading={loadingPredictions}
        />
        <KPICard
          title="Próximos 7 Días"
          value={next7DaysSales}
          format="currency"
          decimals={0}
          icon={Calendar}
          loading={loadingPredictions}
        />
        <KPICard
          title="Productos en Stock"
          value={stockSummary?.total_productos || 0}
          format="number"
          decimals={0}
          icon={Package}
          loading={loadingStock}
        />
      </div>

      {errorStock ? (
        <QueryError
          title="Error al cargar resumen de stock"
          message="No se pudo cargar el resumen de inventario."
          onRetry={() => refetchStock()}
        />
      ) : (
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">
              Críticos
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            {loadingStock ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-red-900">
                {stockSummary?.alertas?.criticos ?? 0}
              </div>
            )}
            <p className="text-xs text-red-600 mt-1">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">
              Stock Bajo
            </CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            {loadingStock ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-yellow-900">
                {stockSummary?.alertas?.bajos ?? 0}
              </div>
            )}
            <p className="text-xs text-yellow-600 mt-1">
              Próximos a agotarse
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              Stock OK
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {loadingStock ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-green-900">
                {stockSummary?.alertas?.ok ?? 0}
              </div>
            )}
            <p className="text-xs text-green-600 mt-1">
              Stock suficiente
            </p>
          </CardContent>
        </Card>
      </div>
      )}

      <div className="grid gap-6 lg:grid-cols-1">
        {errorPredictions ? (
          <QueryError
            title="Error al cargar predicciones"
            message="No se pudieron cargar las predicciones de ventas para la categoría 'Alimento'."
            onRetry={() => refetchPredictions()}
          />
        ) : loadingPredictions ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
        ) : predictions && predictions.predictions.length > 0 ? (
          <SalesForecastChart data={[{
            entity: predictions.entity,
            granularity: predictions.granularity,
            days: predictions.days,
            target: predictions.target,
            total: predictions.total,
            predictions: predictions.predictions
          }]} />
        ) : null}
      </div>

      {errorAlerts ? (
        <QueryError
          title="Error al cargar alertas"
          message="No se pudieron cargar las alertas de stock."
          onRetry={() => refetchAlerts()}
        />
      ) : loadingAlerts ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      ) : criticalAlerts && criticalAlerts.length > 0 ? (
        <StockAlertsTable
          alerts={criticalAlerts}
          title="Alertas Críticas de Stock"
          description="Productos que requieren reposicion urgente"
          maxRows={10}
        />
      ) : null}
    </div>
  );
}
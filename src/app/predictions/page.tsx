"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SalesForecastChart } from "@/components/charts/sales-forecast-chart";
import { usePredictNextDays } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateShort } from "@/lib/utils";

export default function PredictionsPage() {
  const [days, setDays] = useState(30);
  const { data: predictions, isLoading, refetch, isFetching } = usePredictNextDays(days);

  const totalSales = predictions?.reduce((sum, p) => sum + p.predicted_sales, 0) || 0;
  const avgSales = predictions ? totalSales / predictions.length : 0;
  const maxSale = predictions
    ? Math.max(...predictions.map((p) => p.predicted_sales))
    : 0;
  const minSale = predictions
    ? Math.min(...predictions.map((p) => p.predicted_sales))
    : 0;

  const handleExport = () => {
    if (!predictions) return;

    const csv = [
      ["Fecha", "Día", "Ventas Predichas"],
      ...predictions.map((p) => [p.date, p.day_of_week, p.predicted_sales]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `predicciones_${days}dias_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Predicciones de Ventas</h1>
          <p className="text-muted-foreground mt-1">
            Proyecciones de ventas basadas en XGBoost ML
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button onClick={handleExport} disabled={!predictions}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>Selecciona el período de predicción</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Días a predecir:</label>
            <Select
              value={days.toString()}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-48"
            >
              <option value="7">7 días</option>
              <option value="14">14 días</option>
              <option value="30">30 días</option>
              <option value="60">60 días</option>
              <option value="90">90 días</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Proyectado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Promedio Diario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(avgSales)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Venta Máxima
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(maxSale)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Venta Mínima
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(minSale)}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Chart */}
      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      ) : predictions ? (
        <SalesForecastChart data={predictions} />
      ) : null}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Predicciones</CardTitle>
          <CardDescription>
            Valores diarios proyectados (excluye domingos)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : predictions ? (
            <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Día de la Semana</TableHead>
                    <TableHead className="text-right">Ventas Predichas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predictions.map((pred, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {formatDateShort(pred.date)}
                      </TableCell>
                      <TableCell>{pred.day_of_week}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(pred.predicted_sales)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

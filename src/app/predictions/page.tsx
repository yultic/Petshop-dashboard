"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SalesForecastChart } from "@/components/charts/sales-forecast-chart";
import { usePredict, useAvailableEntities } from "@/hooks/use-api";
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
import { CATEGORIAS, Granularity } from "@/types/api";

const GRANULARITIES: Granularity[] = ["categoria", "marca", "producto"];

export default function PredictionsPage() {
  const [days, setDays] = useState(30);
  const [granularity, setGranularity] = useState<Granularity>("categoria");
  const [entity, setEntity] = useState<string>(CATEGORIAS[0]);
  const [entityList, setEntityList] = useState<string[]>(CATEGORIAS as any);

  const { data: availableEntities, isLoading: loadingEntities } = useAvailableEntities(granularity);
  
  useEffect(() => {
    if (availableEntities) {
      const entities = availableEntities.entities.map(e => e.entity);
      setEntityList(entities);
      if (!entities.includes(entity)) {
        setEntity(entities[0] || "");
      }
    } else if (granularity === 'categoria') {
        setEntityList(CATEGORIAS as any);
        setEntity(CATEGORIAS[0]);
    }
  }, [granularity, availableEntities, entity]);

  const { data: predictionResponse, isLoading, refetch, isFetching } = usePredict(granularity, entity, days, !!entity);

  const predictions = predictionResponse?.predictions || [];
  const totalSales = predictionResponse?.total || 0;
  const avgSales = predictionResponse ? totalSales / predictionResponse.days : 0;
  
  const maxSale = predictions.length > 0 
    ? Math.max(...predictions.map((p) => p.predicted_sales || 0))
    : 0;
  const minSale = predictions.length > 0
    ? Math.min(...predictions.map((p) => p.predicted_sales || 0))
    : 0;

  const handleExport = () => {
    if (!predictions) return;

    const csv = [
      ["Fecha", "Día", "Ventas Predichas", "Kilos Predichos"],
      ...predictions.map((p) => [p.date, p.day_of_week, p.predicted_sales, p.predicted_kilos]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `predicciones_${granularity}_${entity}_${days}dias.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Predicciones de Ventas</h1>
          <p className="text-muted-foreground mt-1">
            Proyecciones de ventas y demanda por producto, marca o categoría.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button onClick={handleExport} disabled={!predictions || predictions.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de la Predicción</CardTitle>
          <CardDescription>Selecciona los parámetros para generar la predicción.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">Granularidad</label>
            <Select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value as Granularity)}
            >
              {GRANULARITIES.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Entidad</label>
            <Select
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              disabled={loadingEntities || entityList.length === 0}
            >
              {loadingEntities && <option>Cargando...</option>}
              {entityList.map(e => <option key={e} value={e}>{e}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Período</label>
            <Select
              value={days.toString()}
              onChange={(e) => setDays(Number(e.target.value))}
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

      <div className="grid gap-4 md:grid-cols-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : (
          <>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Total Proyectado</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(totalSales)}</div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Promedio Diario</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(avgSales)}</div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Venta Máxima</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(maxSale)}</div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium text-muted-foreground">Venta Mínima</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(minSale)}</div></CardContent></Card>
          </>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : predictions.length > 0 ? (
        <SalesForecastChart data={[{
            days: days,
            target: granularity,
            entity: entity,
            granularity: granularity,
            total: totalSales,
            predictions: predictions
          }]} 
/>
      ) : (
        <Card className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">No hay datos de predicción para la selección actual.</p>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Detalle de Predicciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : predictions.length > 0 ? (
            <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
              <Table>
                <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Día</TableHead><TableHead className="text-right">Ventas</TableHead><TableHead className="text-right">Kilos</TableHead></TableRow></TableHeader>
                <TableBody>
                  {predictions.map((pred, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{formatDateShort(pred.date)}</TableCell>
                      <TableCell>{pred.day_of_week}</TableCell>
                      <TableCell className="text-right">{formatCurrency(pred.predicted_sales ?? 0)}</TableCell>
                      <TableCell className="text-right">{pred.predicted_kilos?.toFixed(2)} kg</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">No hay datos para mostrar.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAvailableEntities,
  usePredictProduct,
  useTopSellers,
} from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber, formatCurrency } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ProductsPage() {
  const [granularity, setGranularity] = useState<"producto" | "marca" | "categoria">("marca");
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [days, setDays] = useState(30);
  const [target, setTarget] = useState<"kilos" | "ventas">("kilos");

  const { data: entities, isLoading: loadingEntities } = useAvailableEntities(granularity);
  const { data: topSellers, isLoading: loadingTop } = useTopSellers(30, 20, granularity);

  const { data: prediction, isLoading: loadingPrediction } = usePredictProduct(
    {
      entity_name: selectedEntity,
      granularity,
      days,
      target,
    },
    !!selectedEntity
  );

  const totalPredicted = prediction?.reduce(
    (sum, p) => sum + (target === "kilos" ? (p.predicted_kilos || 0) : (p.predicted_sales || 0)),
    0
  ) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Análisis por Producto</h1>
        <p className="text-muted-foreground mt-1">
          Predicciones y análisis de demanda por producto, marca o categoría
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Análisis</CardTitle>
          <CardDescription>Selecciona el nivel de granularidad y entidad</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Granularidad</label>
              <Select
                value={granularity}
                onChange={(e) => {
                  setGranularity(e.target.value as any);
                  setSelectedEntity("");
                }}
              >
                <option value="categoria">Categoría</option>
                <option value="marca">Marca</option>
                <option value="producto">Producto</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Entidad</label>
              <Select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                disabled={loadingEntities}
              >
                <option value="">Seleccionar...</option>
                {entities?.entities.map((entity) => (
                  <option key={entity.entity} value={entity.entity}>
                    {entity.entity} ({entity.num_days} días)
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={days.toString()} onChange={(e) => setDays(Number(e.target.value))}>
                <option value="7">7 días</option>
                <option value="14">14 días</option>
                <option value="30">30 días</option>
                <option value="60">60 días</option>
                <option value="90">90 días</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Métrica</label>
              <Select value={target} onChange={(e) => setTarget(e.target.value as any)}>
                <option value="kilos">Kilos</option>
                <option value="ventas">Ventas ($)</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {selectedEntity && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                Predicción: {selectedEntity}
              </CardTitle>
              <CardDescription>
                Demanda proyectada próximos {days} días
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPrediction ? (
                <Skeleton className="h-[300px] w-full" />
              ) : prediction ? (
                <>
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground">Total Proyectado</p>
                    <p className="text-3xl font-bold">
                      {target === "kilos"
                        ? `${formatNumber(totalPredicted, 1)} kg`
                        : formatCurrency(totalPredicted)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Promedio diario:{" "}
                      {target === "kilos"
                        ? `${formatNumber(totalPredicted / days, 2)} kg`
                        : formatCurrency(totalPredicted / days)}
                    </p>
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={prediction.map((p) => ({
                        date: p.date.split("T")[0],
                        value: target === "kilos" ? p.predicted_kilos : p.predicted_sales,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-3 shadow-lg">
                                <p className="font-medium">{payload[0]?.payload.date}</p>
                                <p className="text-sm text-primary font-bold">
                                  {target === "kilos"
                                    ? `${formatNumber(payload[0]?.value as number, 1)} kg`
                                    : formatCurrency(payload[0]?.value as number)}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              ) : null}
            </CardContent>
          </Card>
        </>
      )}

      {/* Top Sellers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top 20 Más Vendidos
          </CardTitle>
          <CardDescription>
            Últimos 30 días - ordenados por kilos vendidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTop ? (
            <Skeleton className="h-[400px] w-full" />
          ) : topSellers?.top_sellers ? (
            <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>
                      {granularity === "producto" ? "Producto" : granularity === "marca" ? "Marca" : "Categoría"}
                    </TableHead>
                    <TableHead className="text-right">Kilos Vendidos</TableHead>
                    <TableHead className="text-right">Ventas Totales</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topSellers.top_sellers.map((seller, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium text-muted-foreground">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {seller.producto || seller.marca || seller.Producto}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(seller.Kilos_num, 1)} kg
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(seller.Venta_Total)}
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

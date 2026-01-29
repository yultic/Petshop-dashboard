"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { useAvailableEntities, usePredict, useDemandByBrand, useDemandByCategory } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Granularity, CATEGORIAS } from "@/types/api";

const GRANULARITIES: Granularity[] = ["categoria", "marca", "producto"];

export default function ProductsPage() {
  const [granularity, setGranularity] = useState<Granularity>("categoria");
  const [selectedEntity, setSelectedEntity] = useState<string>(CATEGORIAS[0]);
  const [days, setDays] = useState(30);
  const [target, setTarget] = useState<"kilos" | "ventas">("kilos");
  const [entityList, setEntityList] = useState<string[]>(CATEGORIAS as any);

  const { data: entities, isLoading: loadingEntities } = useAvailableEntities(granularity);
  const { data: topBrands, isLoading: loadingTopBrands } = useDemandByBrand(days, 20);
  const { data: topCategories, isLoading: loadingTopCategories } = useDemandByCategory(days);

  useEffect(() => {
    if (entities) {
      const list = entities.entities.map(e => e.entity);
      setEntityList(list);
      if (!list.includes(selectedEntity)) {
        setSelectedEntity(list[0] || "");
      }
    } else if (granularity === 'categoria') {
      setEntityList(CATEGORIAS as any);
      setSelectedEntity(CATEGORIAS[0]);
    }
  }, [granularity, entities, selectedEntity]);

  const { data: prediction, isLoading: loadingPrediction } = usePredict(
    granularity,
    selectedEntity,
    days,
    !!selectedEntity
  );

  const totalPredicted = prediction?.total || 0;

  const topSellers = granularity === 'marca' ? topBrands : (granularity === 'categoria' ? topCategories : undefined);
  const loadingTop = granularity === 'marca' ? loadingTopBrands : loadingTopCategories;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Análisis por Entidad</h1>
        <p className="text-muted-foreground mt-1">
          Predicciones y análisis de demanda por producto, marca o categoría.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Análisis</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Granularidad</label>
            <Select value={granularity} onChange={(e) => setGranularity(e.target.value as any)}>
              {GRANULARITIES.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Entidad</label>
            <Select value={selectedEntity} onChange={(e) => setSelectedEntity(e.target.value)} disabled={loadingEntities || !entityList.length}>
              {loadingEntities && <option>Cargando...</option>}
              {entityList.map((e) => <option key={e} value={e}>{e}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Período</label>
            <Select value={days.toString()} onChange={(e) => setDays(Number(e.target.value))}>
              <option value="7">7 días</option>
              <option value="30">30 días</option>
              <option value="60">60 días</option>
              <option value="90">90 días</option>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Métrica</label>
            <Select value={target} onChange={(e) => setTarget(e.target.value as any)} disabled={granularity !== 'producto'}>
              <option value="kilos">Kilos</option>
              <option value="ventas">Ventas ($)</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedEntity && (
        <Card>
          <CardHeader>
            <CardTitle>Predicción: {selectedEntity}</CardTitle>
            <CardDescription>Demanda proyectada para los próximos {days} días.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPrediction ? <Skeleton className="h-[300px] w-full" /> : prediction ? (
              <>
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">Total Proyectado ({target})</p>
                  <p className="text-3xl font-bold">
                    {target === "kilos" ? `${formatNumber(totalPredicted, 1)} kg` : formatCurrency(totalPredicted)}
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={prediction.predictions.map(p => ({ date: p.date, value: target === "kilos" ? p.predicted_kilos : p.predicted_sales }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(value) => target === 'kilos' ? `${formatNumber(value as number, 2)} kg` : formatCurrency(value as number)} />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
                  </LineChart>
                </ResponsiveContainer>
              </>
            ) : <p>No hay datos de predicción.</p>}
          </CardContent>
        </Card>
      )}

      {granularity !== 'producto' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Top 20 por Demanda</CardTitle>
            <CardDescription>Últimos {days} días, ordenados por kilos vendidos.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTop ? <Skeleton className="h-[400px] w-full" /> : topSellers ? (
              <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>{granularity === "marca" ? "Marca" : "Categoría"}</TableHead>
                      <TableHead className="text-right">Kilos Vendidos</TableHead>
                      <TableHead className="text-right">Promedio Diario (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(topSellers as any[]).map((seller, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{seller.marca || seller.categoria}</TableCell>
                        <TableCell className="text-right">{formatNumber(seller.demanda_total_kg, 1)} kg</TableCell>
                        <TableCell className="text-right">{formatNumber(seller.demanda_promedio_diaria_kg, 2)} kg</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : <p>No hay datos de top sellers.</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
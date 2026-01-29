"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDemandSummary, useDemandByCategory, useDemandByBrand } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DataPage() {
  const [days, setDays] = useState(30);
  const { data: summary, isLoading: loadingSummary } = useDemandSummary(days);
  const { data: byCategory, isLoading: loadingByCategory } = useDemandByCategory(days);
  const { data: byBrand, isLoading: loadingByBrand } = useDemandByBrand(days);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Análisis de Demanda</h1>
        <p className="text-muted-foreground mt-1">
          Demanda histórica por categoría y marca.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Período de Análisis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <Select
              value={days.toString()}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="60">Últimos 60 días</option>
              <option value="90">Últimos 90 días</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loadingSummary ? (
        <Skeleton className="h-64 w-full" />
      ) : summary ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Demanda por Categoría</CardTitle>
              <CardDescription>Total de Kilos vendidos en los últimos {summary.periodo_dias} días.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summary.categorias} layout="vertical" margin={{ left: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="categoria" type="category" width={80} />
                  <Tooltip formatter={(value) => `${formatNumber(value as number, 2)} kg`} />
                  <Legend />
                  <Bar dataKey="demanda_total_kg" name="Demanda Total (KG)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Marcas</CardTitle>
              <CardDescription>Marcas más vendidas en los últimos {summary.periodo_dias} días.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summary.marcas_principales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="marca" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${formatNumber(value as number, 2)} kg`} />
                  <Legend />
                  <Bar dataKey="demanda_total_kg" name="Demanda Total (KG)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detalle por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingByCategory ? <Skeleton className="h-96 w-full" /> : (
              <Table>
                <TableHeader><TableRow><TableHead>Categoría</TableHead><TableHead className="text-right">Demanda Total</TableHead><TableHead className="text-right">Promedio Diario</TableHead></TableRow></TableHeader>
                <TableBody>
                  {byCategory?.map(c => (
                    <TableRow key={c.categoria}>
                      <TableCell>{c.categoria}</TableCell>
                      <TableCell className="text-right">{formatNumber(c.demanda_total_kg, 2)} kg</TableCell>
                      <TableCell className="text-right">{formatNumber(c.demanda_promedio_diaria_kg, 2)} kg</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Detalle por Marca</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingByBrand ? <Skeleton className="h-96 w-full" /> : (
              <Table>
                <TableHeader><TableRow><TableHead>Marca</TableHead><TableHead className="text-right">Demanda Total</TableHead><TableHead className="text-right">Promedio Diario</TableHead></TableRow></TableHeader>
                <TableBody>
                  {byBrand?.map(b => (
                    <TableRow key={b.marca}>
                      <TableCell>{b.marca}</TableCell>
                      <TableCell className="text-right">{formatNumber(b.demanda_total_kg, 2)} kg</TableCell>
                      <TableCell className="text-right">{formatNumber(b.demanda_promedio_diaria_kg, 2)} kg</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
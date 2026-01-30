"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";
import type { DemandByCategoryResponse } from "@/types/api";

interface DemandByCategoryViewProps {
  data: DemandByCategoryResponse;
}

export function DemandByCategoryView({ data }: DemandByCategoryViewProps) {
  const maxDemand = Math.max(...data.map((d) => d.demanda_total_kg), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Demanda por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Total (kg)</TableHead>
              <TableHead className="text-right">Promedio/día</TableHead>
              <TableHead className="w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.categoria}>
                <TableCell className="font-medium">{item.categoria}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatNumber(item.demanda_total_kg, 1)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatNumber(item.demanda_promedio_diaria_kg, 1)}
                </TableCell>
                <TableCell>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${(item.demanda_total_kg / maxDemand) * 100}%`,
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

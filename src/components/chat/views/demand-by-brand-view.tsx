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
import type { DemandByBrandResponse } from "@/types/api";

interface DemandByBrandViewProps {
  data: DemandByBrandResponse;
}

export function DemandByBrandView({ data }: DemandByBrandViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Demanda por Marca</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell w-[40px]">#</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead className="text-right">Total (kg)</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Promedio/día</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={item.marca}>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-medium">{item.marca}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatNumber(item.demanda_total_kg, 1)}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-right font-mono">
                  {formatNumber(item.demanda_promedio_diaria_kg, 1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

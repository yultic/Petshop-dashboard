"use client";

import {
  Card,
  CardContent,
  CardDescription,
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
import type { PurchaseOrderResponse } from "@/types/api";

interface PurchaseOrderViewProps {
  data: PurchaseOrderResponse;
}

export function PurchaseOrderView({ data }: PurchaseOrderViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Orden de Compra Sugerida</CardTitle>
        <CardDescription>
          Período: {data.periodo_dias} días
          {data.proveedor && ` — Proveedor: ${data.proveedor}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Stock Actual (kg)</TableHead>
              <TableHead className="text-right">Demanda Proy. (kg)</TableHead>
              <TableHead className="text-right">Comprar (kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.orden_compra.map((item) => (
              <TableRow key={item.producto}>
                <TableCell className="font-medium">{item.producto}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatNumber(item.stock_actual_kg, 1)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatNumber(item.demanda_proyectada_kg, 1)}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-primary">
                  {formatNumber(item.cantidad_sugerida_kg, 1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

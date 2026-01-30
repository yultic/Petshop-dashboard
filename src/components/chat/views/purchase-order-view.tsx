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
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatCurrency } from "@/lib/utils";
import type { PurchaseOrderResponse } from "@/types/api";

interface PurchaseOrderViewProps {
  data: PurchaseOrderResponse;
}

export function PurchaseOrderView({ data }: PurchaseOrderViewProps) {
  const totalCosto = data.items.reduce((sum, item) => sum + item.costo_total, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Orden de Compra Sugerida</CardTitle>
        <CardDescription>
          {data.items.length} productos — Costo total estimado: {formatCurrency(totalCosto)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="hidden sm:table-cell">Categoría</TableHead>
              <TableHead className="text-right">Cantidad (kg)</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Precio Unit.</TableHead>
              <TableHead className="text-right">Costo Total</TableHead>
              <TableHead className="hidden sm:table-cell">Prioridad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((item) => (
              <TableRow key={item.producto}>
                <TableCell className="font-medium">{item.producto}</TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {item.categoria}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatNumber(item.cantidad_kg, 1)}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-right font-mono">
                  {formatCurrency(item.precio_unitario)}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-primary">
                  {formatCurrency(item.costo_total)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={item.prioridad === "agotado" ? "destructive" : item.prioridad === "critico" ? "secondary" : "outline"}>
                    {item.prioridad.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

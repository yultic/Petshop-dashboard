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
import { formatNumber, formatDateShort } from "@/lib/utils";
import type { StockItem } from "@/types/api";

interface CurrentStockViewProps {
  data: StockItem[];
}

export function CurrentStockView({ data }: CurrentStockViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Inventario Actual ({data.length} productos)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Actualización</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.producto}>
                  <TableCell className="font-medium">
                    {item.producto}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.categoria}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(item.stock_actual_kg, 1)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.unidad_medida}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.proveedor ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateShort(item.fecha_ultima_actualizacion)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

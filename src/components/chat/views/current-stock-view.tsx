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
                <TableHead className="hidden sm:table-cell">Categoría</TableHead>
                <TableHead className="text-right">Stock (kg)</TableHead>
                <TableHead className="text-right">Stock (uds)</TableHead>
                <TableHead className="hidden sm:table-cell">Proveedor</TableHead>
                <TableHead className="hidden sm:table-cell">Actualización</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.producto}>
                  <TableCell className="font-medium">
                    {item.producto}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {item.categoria}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {item.cantidad_kg > 0 ? formatNumber(item.cantidad_kg, 1) : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {item.cantidad_unidades > 0 ? item.cantidad_unidades : "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {item.proveedor && item.proveedor !== "nan" ? item.proveedor : "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {formatDateShort(item.fecha_actualizacion)}
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

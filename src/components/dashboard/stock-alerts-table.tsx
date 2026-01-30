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
import { StockAlert } from "@/types/api";
import { getAlertBadgeVariant, formatNumber } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface StockAlertsTableProps {
  alerts: StockAlert[];
  title?: string;
  description?: string;
  maxRows?: number;
}

export function StockAlertsTable({
  alerts,
  title = "Alertas de Stock",
  description = "Productos que necesitan reposición",
  maxRows,
}: StockAlertsTableProps) {
  const displayAlerts = maxRows ? alerts.slice(0, maxRows) : alerts;

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case "agotado":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "critico":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "bajo":
        return <Info className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {displayAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm font-medium">Sin alertas de stock</p>
            <p className="text-sm text-muted-foreground mt-1">
              Todos los productos tienen stock suficiente
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="hidden sm:table-cell">Categoría</TableHead>
                  <TableHead className="text-right">Stock Actual</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Demanda (30d)</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Cobertura</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayAlerts.map((alert, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.tipo_alerta)}
                        {alert.producto}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {alert.categoria}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(alert.stock_actual_kg, 1)} kg
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right font-mono">
                      {formatNumber(alert.demanda_proyectada_kg, 1)} kg
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                      <span
                        className={`font-medium ${
                          alert.dias_cobertura < 7
                            ? "text-red-600"
                            : alert.dias_cobertura < 14
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {alert.dias_cobertura} días
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getAlertBadgeVariant(alert.tipo_alerta)}>
                        {alert.tipo_alerta.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

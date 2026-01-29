"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StockAlertsTable } from "@/components/dashboard/stock-alerts-table";
import {
  useStockAlerts,
  useSuggestedPurchaseOrder,
  useStockSummary,
} from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ShoppingCart, AlertTriangle, Package, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";

export default function StockPage() {
  const [days] = useState(30);

  const { data: alerts, isLoading: loadingAlerts } = useStockAlerts(days);
  const { data: purchaseOrder, isLoading: loadingPO } = useSuggestedPurchaseOrder(days);
  const { data: summary, isLoading: loadingSummary } = useStockSummary(days);

  const handleExportPO = () => {
    if (!purchaseOrder) return;

    const csv = [
      ["Producto", "Cantidad Sugerida (kg)", "Stock Actual (kg)", "Demanda Proyectada (kg)"],
      ...purchaseOrder.orden_compra.map((item) => [
        item.producto,
        item.cantidad_sugerida_kg,
        item.stock_actual_kg,
        item.demanda_proyectada_kg,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orden_compra_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header * */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Stock</h1>
          <p className="text-muted-foreground mt-1">
            Alertas de inventario y órdenes de compra sugeridas
          </p>
        </div>
        <Button onClick={handleExportPO} disabled={!purchaseOrder || purchaseOrder.orden_compra.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Orden de Compra
        </Button>
      </div>

      {/* Summary Cards * */}
      <div className="grid gap-4 md:grid-cols-4">
        {loadingSummary ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : summary ? (
          <>
            <Card className="border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Críticos/Agotados
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary.alertas?.criticos ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Stock Bajo
                </CardTitle>
                <Package className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.alertas?.bajos ?? 0}</div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Stock OK
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.alertas?.ok ?? 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Productos
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.total_productos ?? 0}</div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Alerts Table * */}
      {loadingAlerts ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      ) : alerts ? (
        <StockAlertsTable alerts={alerts} />
      ) : null}

      {/* Purchase Order * */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Orden de Compra Sugerida
          </CardTitle>
          <CardDescription>
            Productos recomendados para reposición basados en demanda proyectada
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingPO ? (
            <Skeleton className="h-[300px] w-full" />
          ) : purchaseOrder && purchaseOrder.orden_compra.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{purchaseOrder.orden_compra.length}</p>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">A Pedir (kg)</TableHead>
                      <TableHead className="text-right">Stock Actual</TableHead>
                      <TableHead className="text-right">Demanda Proyectada</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrder.orden_compra.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.producto}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-primary">
                          {formatNumber(item.cantidad_sugerida_kg, 1)} kg
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatNumber(item.stock_actual_kg, 1)} kg
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatNumber(item.demanda_proyectada_kg, 1)} kg
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
              <p className="text-sm font-medium">No se requieren compras</p>
              <p className="text-sm text-muted-foreground mt-1">
                El stock actual es suficiente para el período proyectado
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
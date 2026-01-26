"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StockAlertsTable } from "@/components/dashboard/stock-alerts-table";
import {
  useStockAlerts,
  useStockCoverage,
  usePurchaseOrder,
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
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatCurrency } from "@/lib/utils";

export default function StockPage() {
  const [days] = useState(30);
  const { data: alerts, isLoading: loadingAlerts } = useStockAlerts(days);
  const { data: coverage, isLoading: loadingCoverage } = useStockCoverage(days);
  const { data: purchaseOrder, isLoading: loadingPO } = usePurchaseOrder(days);
  const { data: summary, isLoading: loadingSummary } = useStockSummary();

  const handleExportPO = () => {
    if (!purchaseOrder) return;

    const csv = [
      ["Producto", "Categoría", "Cantidad Sugerida (kg)", "Stock Actual (kg)", "Demanda Proyectada (kg)", "Días Cobertura", "Proveedor"],
      ...purchaseOrder.items.map((item) => [
        item.producto,
        item.categoria,
        item.cantidad_sugerida_kg,
        item.stock_actual_kg,
        item.demanda_proyectada_kg,
        item.dias_cobertura,
        item.proveedor || "N/A",
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Stock</h1>
          <p className="text-muted-foreground mt-1">
            Alertas de inventario y órdenes de compra sugeridas
          </p>
        </div>
        <Button onClick={handleExportPO} disabled={!purchaseOrder}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Orden de Compra
        </Button>
      </div>

      {/* Summary Cards */}
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
                  Agotados/Críticos
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(summary.alertas?.agotados ?? 0) + (summary.alertas?.criticos ?? 0)}
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

      {/* Alerts Table */}
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

      {/* Purchase Order */}
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
          ) : purchaseOrder && purchaseOrder.items.length > 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{purchaseOrder.total_items}</p>
                </div>
                {purchaseOrder.costo_estimado_total && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Costo Estimado</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(purchaseOrder.costo_estimado_total)}
                    </p>
                  </div>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">A Pedir (kg)</TableHead>
                      <TableHead className="text-right">Stock Actual</TableHead>
                      <TableHead className="text-center">Cobertura</TableHead>
                      <TableHead>Proveedor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrder.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.producto}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.categoria}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-primary">
                          {formatNumber(item.cantidad_sugerida_kg, 1)} kg
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatNumber(item.stock_actual_kg, 1)} kg
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              item.dias_cobertura < 7
                                ? "destructive"
                                : item.dias_cobertura < 14
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {item.dias_cobertura} días
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.proveedor || "-"}
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

      {/* Coverage Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Cobertura</CardTitle>
          <CardDescription>
            Días de cobertura de stock vs demanda proyectada
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingCoverage ? (
            <Skeleton className="h-[300px] w-full" />
          ) : coverage ? (
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card className="border-red-200 bg-red-50/30">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-muted-foreground">Críticos</p>
                  <p className="text-3xl font-bold">{coverage.productos_criticos}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Menos de 7 días de cobertura
                  </p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50/30">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-muted-foreground">Bajos</p>
                  <p className="text-3xl font-bold">{coverage.productos_bajos}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Entre 7-14 días de cobertura
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/30">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-muted-foreground">OK</p>
                  <p className="text-3xl font-bold">{coverage.productos_ok}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Más de 14 días de cobertura
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import type { ToolResultData } from "@/types/chat";
import { SalesForecastChart } from "@/components/charts/sales-forecast-chart";
import { StockAlertsTable } from "@/components/dashboard/stock-alerts-table";
import { DemandSummaryView } from "./views/demand-summary-view";
import { DemandByCategoryView } from "./views/demand-by-category-view";
import { DemandByBrandView } from "./views/demand-by-brand-view";
import { PurchaseOrderView } from "./views/purchase-order-view";
import { CurrentStockView } from "./views/current-stock-view";
import { AvailableEntitiesView } from "./views/available-entities-view";

interface ToolResultRendererProps {
  result: ToolResultData;
}

export function ToolResultRenderer({ result }: ToolResultRendererProps) {
  switch (result.type) {
    case "prediction":
      return (
        <SalesForecastChart
          data={[result.data]}
          title={`Predicción: ${result.data.entity}`}
          description={`${result.data.days} días — ${result.data.granularity}`}
        />
      );
    case "stock_alerts":
      return <StockAlertsTable alerts={result.data} />;
    case "demand_summary":
      return <DemandSummaryView data={result.data} />;
    case "demand_by_category":
      return <DemandByCategoryView data={result.data} />;
    case "demand_by_brand":
      return <DemandByBrandView data={result.data} />;
    case "purchase_order":
      return <PurchaseOrderView data={result.data} />;
    case "current_stock":
      return <CurrentStockView data={result.data} />;
    case "available_entities":
      return <AvailableEntitiesView data={result.data} />;
    case "upload_result":
      return (
        <div
          className={`rounded-lg border p-4 ${result.data.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
        >
          <p className="text-sm font-medium">{result.data.message}</p>
        </div>
      );
    case "error":
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{result.data.message}</p>
        </div>
      );
    default:
      return null;
  }
}

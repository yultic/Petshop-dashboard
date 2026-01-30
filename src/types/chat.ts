import type {
  PredictionResponse,
  StockAlert,
  DemandSummary,
  DemandByCategoryResponse,
  DemandByBrandResponse,
  PurchaseOrderResponse,
  StockItem,
  AvailableEntitiesResponse,
} from "./api";

export type ToolResultData =
  | { type: "prediction"; data: PredictionResponse }
  | { type: "stock_alerts"; data: StockAlert[] }
  | { type: "demand_summary"; data: DemandSummary }
  | { type: "demand_by_category"; data: DemandByCategoryResponse }
  | { type: "demand_by_brand"; data: DemandByBrandResponse }
  | { type: "purchase_order"; data: PurchaseOrderResponse }
  | { type: "current_stock"; data: StockItem[] }
  | { type: "available_entities"; data: AvailableEntitiesResponse }
  | { type: "upload_result"; data: { success: boolean; message: string } }
  | { type: "error"; data: { message: string } };

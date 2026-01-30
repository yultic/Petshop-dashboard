
import { env } from "@/lib/env";
import {
  PredictionResponseSchema,
  DemandSummarySchema,
  StockAlertsResponseSchema,
  AvailableEntitiesResponseSchema,
  DemandByCategoryResponseSchema,
  DemandByBrandResponseSchema,
  PurchaseOrderResponseSchema,
  StockResponseSchema,
  HealthSchema,
  type PredictionResponse,
  type DemandSummary,
  type StockAlert,
  type AvailableEntitiesResponse,
  type Granularity,
  type DemandByCategoryResponse,
  type DemandByBrandResponse,
  type PurchaseOrderResponse,
  type StockItem,
  type HealthResponse,
} from "@/types/api";
import { z } from "zod";

const API_BASE = env.NEXT_PUBLIC_API_URL;

async function fetchAndValidate<T extends z.ZodTypeAny>(
  url: string,
  schema: T,
  options?: RequestInit
): Promise<z.infer<T>> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `Request failed with status ${res.status}`);
  }
  const data = await res.json();
  return schema.parse(data);
}

// ==================== HEALTH ====================

export async function getHealth(): Promise<HealthResponse> {
  const url = `${API_BASE}/health`;
  return fetchAndValidate(url, HealthSchema);
}

// ==================== PREDICTIONS ====================

export async function predict(
  granularity: Omit<Granularity, "producto">,
  name: string,
  days: number = 30,
  target: "kilos" | "ventas" = "kilos"
): Promise<PredictionResponse> {
  const url = `${API_BASE}/api/v1/products/predict/${granularity}/${encodeURIComponent(name)}?days=${days}&target=${target}`;
  return fetchAndValidate(url, PredictionResponseSchema);
}

export async function predictProduct(
  name: string,
  days: number = 30,
  target: "kilos" | "ventas" = "kilos"
): Promise<PredictionResponse> {
  const url = `${API_BASE}/api/v1/products/predict/producto/${encodeURIComponent(name)}?days=${days}&target=${target}`;
  return fetchAndValidate(url, PredictionResponseSchema);
}

// ==================== DEMAND ====================

export async function getDemandSummary(days: number = 30): Promise<DemandSummary> {
  const url = `${API_BASE}/api/v1/products/demand/summary?days=${days}`;
  return fetchAndValidate(url, DemandSummarySchema);
}

export async function getDemandByCategory(days: number = 30): Promise<DemandByCategoryResponse> {
  const url = `${API_BASE}/api/v1/products/demand/by-category?days=${days}`;
  return fetchAndValidate(url, DemandByCategoryResponseSchema);
}

export async function getDemandByBrand(days: number = 30, top: number = 20): Promise<DemandByBrandResponse> {
  const url = `${API_BASE}/api/v1/products/demand/by-brand?days=${days}&top=${top}`;
  return fetchAndValidate(url, DemandByBrandResponseSchema);
}

// ==================== STOCK ====================

export async function getStockAlerts(days: number = 30): Promise<StockAlert[]> {
  const url = `${API_BASE}/api/v1/stock/alerts/all?days=${days}`;
  return fetchAndValidate(url, StockAlertsResponseSchema);
}

export async function getSuggestedPurchaseOrder(days: number = 30): Promise<PurchaseOrderResponse> {
  const url = `${API_BASE}/api/v1/stock/purchase-order?days=${days}`;
  return fetchAndValidate(url, PurchaseOrderResponseSchema);
}

export async function getCurrentStock(): Promise<StockItem[]> {
  const url = `${API_BASE}/api/v1/stock/`;
  return fetchAndValidate(url, StockResponseSchema);
}

// ==================== AVAILABLE ENTITIES ====================

export async function getAvailableEntities(granularity: Granularity): Promise<AvailableEntitiesResponse> {
  const url = `${API_BASE}/api/v1/products/available/${granularity}`;
  return fetchAndValidate(url, AvailableEntitiesResponseSchema);
}

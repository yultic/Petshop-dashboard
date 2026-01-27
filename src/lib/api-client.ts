/**
 * API Client para el backend de predicciones
 * Centraliza todas las llamadas HTTP con tipos seguros
 */

import type {
  PredictionResponse,
  ProductPredictionItem,
  ProductPredictionRequest,
  AvailableEntitiesResponse,
  DemandSummaryResponse,
  StockItemResponse,
  StockItemCreate,
  StockAdjustRequest,
  StockAlertResponse,
  StockSummaryResponse,
  PurchaseOrderResponse,
  DataStatsResponse,
  HistoricalDataResponse,
  ModelInfo,
  ModelPerformanceComparison,
  UploadResponse,
  HealthResponse,
  APIInfo,
  TopSellersResponse,
  ProductTrendsResponse,
  StockCoverageAnalysis,
} from "@/types/api";
import { env } from "@/lib/env";

const API_URL = env.NEXT_PUBLIC_API_URL;

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ==================== HEALTH & INFO ====================

  async getAPIInfo(): Promise<APIInfo> {
    return this.request<APIInfo>("/");
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  // ==================== PREDICTIONS AGGREGATED ====================

  async predictNextDays(days: number, modelType: string = "xgboost"): Promise<PredictionResponse[]> {
    return this.request<PredictionResponse[]>(
      `/api/v1/predict/next/${days}?model_type=${modelType}`,
      { method: "POST" }
    );
  }

  async predictRange(startDate: string, endDate: string): Promise<PredictionResponse[]> {
    return this.request<PredictionResponse[]>("/api/v1/predict/range", {
      method: "POST",
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate,
        model_type: "xgboost",
      }),
    });
  }

  // ==================== PREDICTIONS BY PRODUCT ====================

  async predictProduct(request: ProductPredictionRequest): Promise<ProductPredictionItem[]> {
    return this.request<ProductPredictionItem[]>("/api/v1/products/predict", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async predictProductByPath(
    granularity: string,
    entityName: string,
    days: number = 30,
    target: "kilos" | "ventas" = "kilos"
  ): Promise<{
    entity: string;
    granularity: string;
    days: number;
    target: string;
    total: number;
    predictions: ProductPredictionItem[];
  }> {
    return this.request(
      `/api/v1/products/predict/${granularity}/${encodeURIComponent(entityName)}?days=${days}&target=${target}`
    );
  }

  async getDemandSummary(days: number = 30): Promise<DemandSummaryResponse> {
    return this.request<DemandSummaryResponse>(`/api/v1/products/demand/summary?days=${days}`);
  }

  async getDemandByCategory(days: number = 30) {
    return this.request(`/api/v1/products/demand/by-category?days=${days}`);
  }

  async getDemandByBrand(days: number = 30, top: number = 20) {
    return this.request(`/api/v1/products/demand/by-brand?days=${days}&top=${top}`);
  }

  async getAvailableEntities(
    granularity: string,
    minRecords: number = 30
  ): Promise<AvailableEntitiesResponse> {
    return this.request<AvailableEntitiesResponse>(
      `/api/v1/products/analysis/available/${granularity}?min_records=${minRecords}`
    );
  }

  async getAllAvailableEntities() {
    return this.request(`/api/v1/products/available`);
  }

  // ==================== STOCK ====================

  async getAllStock(): Promise<StockItemResponse[]> {
    return this.request<StockItemResponse[]>("/api/v1/stock/");
  }

  async getStockSummary(): Promise<StockSummaryResponse> {
    return this.request<StockSummaryResponse>("/api/v1/stock/summary");
  }

  async getStockItem(producto: string): Promise<StockItemResponse> {
    return this.request<StockItemResponse>(`/api/v1/stock/${encodeURIComponent(producto)}`);
  }

  async createOrUpdateStock(item: StockItemCreate): Promise<StockItemResponse> {
    return this.request<StockItemResponse>("/api/v1/stock/", {
      method: "POST",
      body: JSON.stringify(item),
    });
  }

  async adjustStock(producto: string, adjustment: StockAdjustRequest): Promise<StockItemResponse> {
    return this.request<StockItemResponse>(
      `/api/v1/stock/${encodeURIComponent(producto)}/adjust`,
      {
        method: "PATCH",
        body: JSON.stringify(adjustment),
      }
    );
  }

  async deleteStockItem(producto: string) {
    return this.request(`/api/v1/stock/${encodeURIComponent(producto)}`, {
      method: "DELETE",
    });
  }

  async getStockAlerts(days: number = 30): Promise<StockAlertResponse[]> {
    return this.request<StockAlertResponse[]>(`/api/v1/stock/analysis/alerts/all?days=${days}`);
  }

  async getCriticalAlerts(days: number = 30): Promise<StockAlertResponse[]> {
    return this.request<StockAlertResponse[]>(`/api/v1/stock/alerts/critical?days=${days}`);
  }

  async generatePurchaseOrder(
    days: number = 30,
    proveedor?: string
  ): Promise<PurchaseOrderResponse> {
    const params = new URLSearchParams({ days: days.toString() });
    if (proveedor) params.append("proveedor", proveedor);
    return this.request<PurchaseOrderResponse>(`/api/v1/stock/analysis/purchase-order?${params}`);
  }

  async analyzeStockCoverage(days: number = 30): Promise<StockCoverageAnalysis> {
    return this.request<StockCoverageAnalysis>(`/api/v1/stock/analysis/coverage?days=${days}`);
  }

  // ==================== DATA ====================

  async getHistoricalData(
    startDate?: string,
    endDate?: string,
    limit: number = 1000
  ): Promise<HistoricalDataResponse> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    return this.request<HistoricalDataResponse>(`/api/v1/data/historical?${params}`);
  }

  async getDataStats(): Promise<DataStatsResponse> {
    return this.request<DataStatsResponse>("/api/v1/data/stats");
  }

  // ==================== MODELS ====================

  async listModels(): Promise<ModelInfo[]> {
    return this.request<ModelInfo[]>("/api/v1/models");
  }

  async getModelMetrics(modelId: string) {
    return this.request(`/api/v1/models/${encodeURIComponent(modelId)}/metrics`);
  }

  async getModelPerformance(): Promise<ModelPerformanceComparison> {
    return this.request<ModelPerformanceComparison>("/api/v1/models/performance");
  }

  // ==================== ANALYSIS ====================

  async getTopSellers(
    days: number = 30,
    top: number = 20,
    granularity: string = "producto"
  ): Promise<TopSellersResponse> {
    return this.request<TopSellersResponse>(
      `/api/v1/products/analysis/top-sellers?days=${days}&top=${top}&granularity=${granularity}`
    );
  }

  async getProductTrends(
    entityName: string,
    granularity: string = "producto"
  ): Promise<ProductTrendsResponse> {
    return this.request<ProductTrendsResponse>(
      `/api/v1/products/analysis/trends/${encodeURIComponent(entityName)}?granularity=${granularity}`
    );
  }

  // ==================== UPLOAD ====================

  async uploadExcel(file: File, retrain: boolean = true): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${this.baseURL}/api/v1/upload/excel?retrain=${retrain}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getTrainingStatus() {
    return this.request("/api/v1/upload/status");
  }

  async forceRetrain(sync: boolean = false) {
    return this.request(`/api/v1/upload/retrain?sync=${sync}`, {
      method: "POST",
    });
  }
}

export const apiClient = new APIClient(API_URL);

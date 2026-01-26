/**
 * Custom hooks usando TanStack Query
 * Manejo centralizado de estado server-side
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  ProductPredictionRequest,
  StockItemCreate,
  StockAdjustRequest,
} from "@/types/api";

// ==================== QUERY KEYS ====================

export const queryKeys = {
  health: ["health"] as const,
  apiInfo: ["api-info"] as const,
  predictions: {
    all: ["predictions"] as const,
    nextDays: (days: number) => ["predictions", "next-days", days] as const,
    range: (start: string, end: string) => ["predictions", "range", start, end] as const,
  },
  products: {
    all: ["products"] as const,
    prediction: (req: ProductPredictionRequest) => ["products", "prediction", req] as const,
    available: (granularity: string) => ["products", "available", granularity] as const,
    demandSummary: (days: number) => ["products", "demand-summary", days] as const,
    topSellers: (days: number, top: number, granularity: string) => 
      ["products", "top-sellers", days, top, granularity] as const,
    trends: (entity: string, granularity: string) => 
      ["products", "trends", entity, granularity] as const,
  },
  stock: {
    all: ["stock"] as const,
    summary: ["stock", "summary"] as const,
    item: (producto: string) => ["stock", "item", producto] as const,
    alerts: (days: number) => ["stock", "alerts", days] as const,
    criticalAlerts: (days: number) => ["stock", "alerts", "critical", days] as const,
    coverage: (days: number) => ["stock", "coverage", days] as const,
    purchaseOrder: (days: number, proveedor?: string) => 
      ["stock", "purchase-order", days, proveedor] as const,
  },
  data: {
    stats: ["data", "stats"] as const,
    historical: (start?: string, end?: string, limit?: number) => 
      ["data", "historical", start, end, limit] as const,
  },
  models: {
    all: ["models"] as const,
    metrics: (modelId: string) => ["models", "metrics", modelId] as const,
    performance: ["models", "performance"] as const,
  },
};

// ==================== HEALTH & INFO ====================

export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => apiClient.getHealth(),
    refetchInterval: 30000, // Refresh every 30s
  });
}

export function useAPIInfo() {
  return useQuery({
    queryKey: queryKeys.apiInfo,
    queryFn: () => apiClient.getAPIInfo(),
  });
}

// ==================== PREDICTIONS ====================

export function usePredictNextDays(days: number, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.predictions.nextDays(days),
    queryFn: () => apiClient.predictNextDays(days),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePredictRange(startDate: string, endDate: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.predictions.range(startDate, endDate),
    queryFn: () => apiClient.predictRange(startDate, endDate),
    enabled,
  });
}

// ==================== PRODUCTS ====================

export function usePredictProduct(request: ProductPredictionRequest, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.products.prediction(request),
    queryFn: () => apiClient.predictProduct(request),
    enabled,
  });
}

export function useAvailableEntities(granularity: string, minRecords: number = 30) {
  return useQuery({
    queryKey: queryKeys.products.available(granularity),
    queryFn: () => apiClient.getAvailableEntities(granularity, minRecords),
  });
}

export function useDemandSummary(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.products.demandSummary(days),
    queryFn: () => apiClient.getDemandSummary(days),
    staleTime: 10 * 60 * 1000,
  });
}

export function useTopSellers(days: number = 30, top: number = 20, granularity: string = "producto") {
  return useQuery({
    queryKey: queryKeys.products.topSellers(days, top, granularity),
    queryFn: () => apiClient.getTopSellers(days, top, granularity),
  });
}

export function useProductTrends(entityName: string, granularity: string = "producto") {
  return useQuery({
    queryKey: queryKeys.products.trends(entityName, granularity),
    queryFn: () => apiClient.getProductTrends(entityName, granularity),
  });
}

// ==================== STOCK ====================

export function useAllStock() {
  return useQuery({
    queryKey: queryKeys.stock.all,
    queryFn: () => apiClient.getAllStock(),
  });
}

export function useStockSummary() {
  return useQuery({
    queryKey: queryKeys.stock.summary,
    queryFn: () => apiClient.getStockSummary(),
  });
}

export function useStockItem(producto: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.stock.item(producto),
    queryFn: () => apiClient.getStockItem(producto),
    enabled,
  });
}

export function useStockAlerts(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.stock.alerts(days),
    queryFn: () => apiClient.getStockAlerts(days),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCriticalAlerts(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.stock.criticalAlerts(days),
    queryFn: () => apiClient.getCriticalAlerts(days),
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useStockCoverage(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.stock.coverage(days),
    queryFn: () => apiClient.analyzeStockCoverage(days),
  });
}

export function usePurchaseOrder(days: number = 30, proveedor?: string) {
  return useQuery({
    queryKey: queryKeys.stock.purchaseOrder(days, proveedor),
    queryFn: () => apiClient.generatePurchaseOrder(days, proveedor),
  });
}

// ==================== STOCK MUTATIONS ====================

export function useCreateOrUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: StockItemCreate) => apiClient.createOrUpdateStock(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stock.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stock.summary });
    },
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ producto, adjustment }: { producto: string; adjustment: StockAdjustRequest }) =>
      apiClient.adjustStock(producto, adjustment),
    onSuccess: (_, { producto }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stock.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stock.item(producto) });
      queryClient.invalidateQueries({ queryKey: queryKeys.stock.summary });
    },
  });
}

export function useDeleteStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (producto: string) => apiClient.deleteStockItem(producto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stock.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stock.summary });
    },
  });
}

// ==================== DATA ====================

export function useDataStats() {
  return useQuery({
    queryKey: queryKeys.data.stats,
    queryFn: () => apiClient.getDataStats(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useHistoricalData(startDate?: string, endDate?: string, limit: number = 1000) {
  return useQuery({
    queryKey: queryKeys.data.historical(startDate, endDate, limit),
    queryFn: () => apiClient.getHistoricalData(startDate, endDate, limit),
  });
}

// ==================== MODELS ====================

export function useModels() {
  return useQuery({
    queryKey: queryKeys.models.all,
    queryFn: () => apiClient.listModels(),
  });
}

export function useModelPerformance() {
  return useQuery({
    queryKey: queryKeys.models.performance,
    queryFn: () => apiClient.getModelPerformance(),
  });
}

// ==================== UPLOAD ====================

export function useUploadExcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, retrain }: { file: File; retrain?: boolean }) =>
      apiClient.uploadExcel(file, retrain ?? true),
    onSuccess: () => {
      // Invalidate all data-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.data.stats });
      queryClient.invalidateQueries({ queryKey: queryKeys.predictions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.models.all });
    },
  });
}

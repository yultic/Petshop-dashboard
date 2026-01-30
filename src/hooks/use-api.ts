'use client'
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "@/lib/api-client";
import type { Granularity } from "@/types/api";
import { useMutation } from '@tanstack/react-query';

export const queryKeys = {
  health: ["health"] as const,
  predictions: (granularity: Granularity, name: string, days: number) => ["predictions", granularity, name, days] as const,
  demandSummary: (days: number) => ["demandSummary", days] as const,
  demandByCategory: (days: number) => ["demandByCategory", days] as const,
  demandByBrand: (days: number, top: number) => ["demandByBrand", days, top] as const,
  stock: {
    all: ["stock"] as const,
    alerts: (days: number) => ["stock", "alerts", days] as const,
    purchaseOrder: (days: number) => ["stock", "purchaseOrder", days] as const,
  },
  availableEntities: (granularity: Granularity) => ["availableEntities", granularity] as const,
};

export function useUploadExcel() {
  return useMutation({
    mutationFn: async (data: { file: File; retrain?: boolean }) => {
      const formData = new FormData();
      formData.append('file', data.file);
      const params = new URLSearchParams();
      if (data.retrain !== undefined) {
        params.set('retrain', data.retrain.toString());
      }
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload/excel${query}`,
        { method: 'POST', body: formData }
      );
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(error.message || `Request failed with status ${res.status}`);
      }
      return res.json();
    },
  });
}


export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => apiClient.getHealth(),
    refetchInterval: 60000, // Refetch every minute
  });
}


export function usePredict(
  granularity: Granularity,
  name: string,
  days: number = 30,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.predictions(granularity, name, days),
    queryFn: () => {
      if (granularity === 'producto') {
        return apiClient.predictProduct(name, days);
      }
      return apiClient.predict(granularity, name, days);
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDemandSummary(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.demandSummary(days),
    queryFn: () => apiClient.getDemandSummary(days),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useDemandByCategory(days: number = 30) {
    return useQuery({
        queryKey: queryKeys.demandByCategory(days),
        queryFn: () => apiClient.getDemandByCategory(days),
        staleTime: 10 * 60 * 1000,
    });
}

export function useDemandByBrand(days: number = 30, top: number = 20) {
    return useQuery({
        queryKey: queryKeys.demandByBrand(days, top),
        queryFn: () => apiClient.getDemandByBrand(days, top),
        staleTime: 10 * 60 * 1000,
    });
}

export function useStockAlerts(days: number = 30, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.stock.alerts(days),
    queryFn: () => apiClient.getStockAlerts(days),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCriticalStockAlerts(days: number = 30, enabled: boolean = true) {
    return useQuery({
        queryKey: [...queryKeys.stock.alerts(days), "critical"],
        queryFn: async () => {
            const alerts = await apiClient.getStockAlerts(days);
            return alerts.filter(a => a.tipo_alerta === 'critico' || a.tipo_alerta === 'agotado');
        },
        enabled,
        staleTime: 5 * 60 * 1000,
    });
}


export function useSuggestedPurchaseOrder(days: number = 30) {
    return useQuery({
        queryKey: queryKeys.stock.purchaseOrder(days),
        queryFn: () => apiClient.getSuggestedPurchaseOrder(days),
        staleTime: 10 * 60 * 1000,
    });
}

export function useCurrentStock() {
    return useQuery({
        queryKey: queryKeys.stock.all,
        queryFn: () => apiClient.getCurrentStock(),
        staleTime: 5 * 60 * 1000,
    });
}

export function useStockSummary(days: number = 30) {
    const { data: stock } = useCurrentStock();
    const { data: alerts } = useStockAlerts(days);

    return useQuery({
        queryKey: ["stockSummary", stock, alerts],
        queryFn: () => {
            if (!stock || !alerts) return null;
            const summary = {
                total_productos: stock.length,
                alertas: {
                    criticos: alerts.filter(a => a.tipo_alerta === 'critico' || a.tipo_alerta === 'agotado').length,
                    bajos: alerts.filter(a => a.tipo_alerta === 'bajo').length,
                    ok: alerts.filter(a => a.tipo_alerta === 'ok').length,
                }
            };
            return summary;
        },
        enabled: !!stock && !!alerts,
        staleTime: 5 * 60 * 1000,
    });
}

export function useAvailableEntities(granularity: Granularity) {
  return useQuery({
    queryKey: queryKeys.availableEntities(granularity),
    queryFn: () => apiClient.getAvailableEntities(granularity),
  });
}

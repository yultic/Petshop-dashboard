import { z } from "zod";
import * as apiClient from "@/lib/api-client";
import { GranularitySchema } from "@/types/api";
import type { ToolSet } from "ai";

export const petshopTools = {
  get_stock_alerts: {
    description:
      "Obtiene las alertas de stock (inventario). Muestra qué productos están agotados, en nivel crítico, bajo u ok. Usa esto cuando pregunten sobre inventario, stock, alertas o productos que se están agotando.",
    inputSchema: z.object({
      days: z
        .number()
        .default(30)
        .describe("Días de proyección para calcular alertas"),
    }),
    execute: async ({ days }: { days: number }) => {
      const data = await apiClient.getStockAlerts(days);
      return { type: "stock_alerts" as const, data };
    },
  },

  predict_product: {
    description:
      "Predice ventas futuras de un producto específico usando el modelo ML. Usa esto cuando pregunten sobre predicciones o pronósticos de un producto en particular.",
    inputSchema: z.object({
      name: z.string().describe("Nombre exacto del producto"),
      days: z.number().default(30).describe("Días a predecir"),
      target: z
        .enum(["kilos", "ventas"])
        .default("kilos")
        .describe("Si predecir kilos o ventas en dólares"),
    }),
    execute: async ({
      name,
      days,
      target,
    }: {
      name: string;
      days: number;
      target: "kilos" | "ventas";
    }) => {
      const data = await apiClient.predictProduct(name, days, target);
      return { type: "prediction" as const, data };
    },
  },

  predict_category: {
    description:
      "Predice ventas futuras de una categoría completa (Alimento, Varios, Higiene, Juguete, Collar, Ropa, Cama, Baño, Comedero). Usa esto cuando pregunten sobre predicciones de una categoría.",
    inputSchema: z.object({
      name: z.string().describe("Nombre de la categoría"),
      days: z.number().default(30).describe("Días a predecir"),
      target: z
        .enum(["kilos", "ventas"])
        .default("kilos")
        .describe("Si predecir kilos o ventas en dólares"),
    }),
    execute: async ({ name, days, target }: { name: string; days: number; target: "kilos" | "ventas" }) => {
      const data = await apiClient.predict("categoria", name, days, target);
      return { type: "prediction" as const, data };
    },
  },

  predict_brand: {
    description:
      "Predice ventas futuras de una marca específica. Usa esto cuando pregunten sobre predicciones de una marca.",
    inputSchema: z.object({
      name: z.string().describe("Nombre de la marca"),
      days: z.number().default(30).describe("Días a predecir"),
      target: z
        .enum(["kilos", "ventas"])
        .default("kilos")
        .describe("Si predecir kilos o ventas en dólares"),
    }),
    execute: async ({ name, days, target }: { name: string; days: number; target: "kilos" | "ventas" }) => {
      const data = await apiClient.predict("marca", name, days, target);
      return { type: "prediction" as const, data };
    },
  },

  get_demand_summary: {
    description:
      "Obtiene un resumen general de la demanda proyectada: categorías y marcas principales con sus totales en kg. Usa esto para dar una visión general del negocio.",
    inputSchema: z.object({
      days: z.number().default(30).describe("Período de días para el resumen"),
    }),
    execute: async ({ days }: { days: number }) => {
      const data = await apiClient.getDemandSummary(days);
      return { type: "demand_summary" as const, data };
    },
  },

  get_demand_by_category: {
    description:
      "Obtiene la demanda desglosada por categoría. Muestra cuántos kg se proyectan por cada categoría de productos.",
    inputSchema: z.object({
      days: z.number().default(30).describe("Período de días"),
    }),
    execute: async ({ days }: { days: number }) => {
      const data = await apiClient.getDemandByCategory(days);
      return { type: "demand_by_category" as const, data };
    },
  },

  get_demand_by_brand: {
    description:
      "Obtiene la demanda desglosada por marca. Muestra el ranking de marcas más vendidas.",
    inputSchema: z.object({
      days: z.number().default(30).describe("Período de días"),
      top: z.number().default(20).describe("Cantidad de marcas top a mostrar"),
    }),
    execute: async ({ days, top }: { days: number; top: number }) => {
      const data = await apiClient.getDemandByBrand(days, top);
      return { type: "demand_by_brand" as const, data };
    },
  },

  get_purchase_order: {
    description:
      "Genera una orden de compra sugerida basada en las proyecciones de demanda y el stock actual. Usa esto cuando pregunten qué comprar o reabastecer.",
    inputSchema: z.object({
      days: z.number().default(30).describe("Período de días para proyectar"),
    }),
    execute: async ({ days }: { days: number }) => {
      const data = await apiClient.getSuggestedPurchaseOrder(days);
      return { type: "purchase_order" as const, data };
    },
  },

  get_current_stock: {
    description:
      "Obtiene el inventario actual completo con cantidades, categorías y proveedores de todos los productos.",
    inputSchema: z.object({}),
    execute: async () => {
      const data = await apiClient.getCurrentStock();
      return { type: "current_stock" as const, data };
    },
  },

  get_available_products: {
    description:
      "Lista las entidades disponibles (productos, marcas o categorías) que tienen datos para hacer predicciones. Usa esto antes de predecir si no sabes el nombre exacto.",
    inputSchema: z.object({
      granularity: GranularitySchema.describe(
        "Tipo de entidad: producto, marca o categoria"
      ),
    }),
    execute: async ({ granularity }: { granularity: "producto" | "marca" | "categoria" }) => {
      const data = await apiClient.getAvailableEntities(granularity);
      return { type: "available_entities" as const, data };
    },
  },
} satisfies ToolSet;

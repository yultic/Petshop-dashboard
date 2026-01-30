import { z } from "zod";

export const GranularitySchema = z.enum(["producto", "marca", "categoria"]);
export type Granularity = z.infer<typeof GranularitySchema>;

export const CATEGORIAS = [
  "Alimento", "Varios", "Higiene", "Juguete",
  "Collar", "Ropa", "Cama", "Baño", "Comedero"
] as const;
export type Category = (typeof CATEGORIAS)[number];

export const HealthSchema = z.object({
  status: z.string(),
  models_loaded: z.number(),
});
export type HealthResponse = z.infer<typeof HealthSchema>;


export const PredictionItemSchema = z.object({
  date: z.string(),
  entity: z.string(),
  granularity: GranularitySchema,
  predicted_kilos: z.number().nullable(),
  predicted_sales: z.number().nullable(),
  day_of_week: z.number(),
});
export type Prediction = z.infer<typeof PredictionItemSchema>;

export const PredictionResponseSchema = z.object({
  entity: z.string(),
  granularity: GranularitySchema,
  days: z.number(),
  target: z.string(),
  total: z.number(),
  predictions: z.array(PredictionItemSchema),
});
export type PredictionResponse = z.infer<typeof PredictionResponseSchema>;

export const DemandSummarySchema = z.object({
  periodo_dias: z.number(),
  categorias: z.array(z.object({
    categoria: z.string(),
    demanda_total_kg: z.number(),
    demanda_promedio_diaria_kg: z.number(),
  })),
  marcas_principales: z.array(z.object({
    marca: z.string(),
    demanda_total_kg: z.number(),
    demanda_promedio_diaria_kg: z.number(),
  })),
});
export type DemandSummary = z.infer<typeof DemandSummarySchema>;

export const DemandByCategoryItemSchema = z.object({
  categoria: z.string(),
  demanda_total_kg: z.number(),
  demanda_promedio_diaria_kg: z.number(),
});
export const DemandByCategoryResponseSchema = z.array(DemandByCategoryItemSchema);
export type DemandByCategoryResponse = z.infer<typeof DemandByCategoryResponseSchema>;

export const DemandByBrandItemSchema = z.object({
  marca: z.string(),
  demanda_total_kg: z.number(),
  demanda_promedio_diaria_kg: z.number(),
});
export const DemandByBrandResponseSchema = z.array(DemandByBrandItemSchema);
export type DemandByBrandResponse = z.infer<typeof DemandByBrandResponseSchema>;


export const StockAlertSchema = z.object({
  producto: z.string(),
  categoria: z.string(),
  stock_actual_kg: z.number(),
  stock_minimo_kg: z.number(),
  demanda_proyectada_kg: z.number(),
  dias_cobertura: z.number(),
  tipo_alerta: z.enum(["agotado", "critico", "bajo", "ok"]),
  recomendacion_compra_kg: z.number(),
  prioridad: z.number(),
});
export const StockAlertsResponseSchema = z.array(StockAlertSchema);
export type StockAlert = z.infer<typeof StockAlertSchema>;

export const PurchaseOrderItemSchema = z.object({
  producto: z.string(),
  categoria: z.string(),
  cantidad_kg: z.number(),
  proveedor: z.string(),
  precio_unitario: z.number(),
  costo_total: z.number(),
  prioridad: z.string(),
});
export const PurchaseOrderResponseSchema = z.object({
  fecha_generacion: z.string(),
  items: z.array(PurchaseOrderItemSchema),
});
export type PurchaseOrderResponse = z.infer<typeof PurchaseOrderResponseSchema>;

export const StockItemSchema = z.object({
  producto: z.string(),
  categoria: z.string(),
  cantidad_kg: z.number(),
  cantidad_unidades: z.number(),
  precio_costo: z.number(),
  precio_venta: z.number(),
  proveedor: z.string().nullable(),
  fecha_actualizacion: z.string(),
  stock_minimo_kg: z.number(),
  stock_minimo_unidades: z.number(),
});
export const StockResponseSchema = z.array(StockItemSchema);
export type StockItem = z.infer<typeof StockItemSchema>;

export const AvailableEntitySchema = z.object({
  entity: z.string(),
  total_kilos: z.number(),
  num_days: z.number(),
  total_sales: z.number(),
});
export const AvailableEntitiesResponseSchema = z.object({
  granularity: GranularitySchema,
  count: z.number(),
  entities: z.array(AvailableEntitySchema),
});
export type AvailableEntity = z.infer<typeof AvailableEntitySchema>;
export type AvailableEntitiesResponse = z.infer<typeof AvailableEntitiesResponseSchema>;
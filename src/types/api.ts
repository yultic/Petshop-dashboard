
export interface PredictionResponse {
  date: string;
  predicted_sales: number;
  day_of_week: string;
  is_weekend?: boolean;
  confidence_interval?: {
    lower: number;
    upper: number;
  };
}

export interface ProductPredictionItem {
  date: string;
  predicted_kilos?: number;
  predicted_sales?: number;
  day_of_week: string;
}

export interface CategoryPredictionResponse {
  category: string;
  predictions: ProductPredictionItem[];
  total_predicted_kilos?: number;
  total_predicted_sales?: number;
}

// ==================== PRODUCT TYPES ====================

export interface ProductPredictionRequest {
  entity_name: string;
  granularity: 'producto' | 'marca' | 'tipo' | 'categoria';
  days: number;
  target: 'kilos' | 'ventas';
}

export interface AvailableEntity {
  entity: string;
  num_days: number;
  total_kilos: number;
  total_sales: number;
}

export interface AvailableEntitiesResponse {
  granularity: string;
  count: number;
  entities: AvailableEntity[];
}

export interface DemandSummaryResponse {
  periodo_dias: number;
  categorias: Array<{
    categoria: string;
    demanda_total_kg: number;
    demanda_promedio_diaria_kg: number;
    ventas_proyectadas?: number;
    historico_total_kg: number;
    historico_dias: number;
  }>;
  marcas: Array<{
    marca: string;
    demanda_total_kg: number;
    demanda_promedio_diaria_kg: number;
    historico_total_kg: number;
    historico_ventas: number;
  }>;
}

// ==================== STOCK TYPES ====================

export interface StockItemResponse {
  producto: string;
  categoria: string;
  cantidad_kg: number;
  cantidad_unidades: number;
  precio_costo?: number;
  precio_venta?: number;
  proveedor?: string;
  stock_minimo_kg?: number;
  stock_minimo_unidades?: number;
  ultima_actualizacion: string;
}

export interface StockItemCreate {
  producto: string;
  categoria: string;
  cantidad_kg: number;
  cantidad_unidades?: number;
  precio_costo?: number;
  precio_venta?: number;
  proveedor?: string;
  stock_minimo_kg?: number;
  stock_minimo_unidades?: number;
}

export interface StockAdjustRequest {
  cantidad_kg_delta?: number;
  cantidad_unidades_delta?: number;
  motivo: string;
}

export interface StockAlertResponse {
  producto: string;
  categoria: string;
  tipo_alerta: 'agotado' | 'critico' | 'bajo' | 'ok';
  stock_actual_kg: number;
  demanda_proyectada_kg: number;
  dias_cobertura: number;
  cantidad_sugerida_reposicion_kg?: number;
  proveedor?: string;
  mensaje: string;
}

export interface StockSummaryResponse {
  total_productos: number;
  total_categorias: number;
  valor_inventario_total?: number;
  alertas?: {
    agotados: number;
    criticos: number;
    bajos: number;
    ok: number;
  };
}

export interface PurchaseOrderItem {
  producto: string;
  categoria: string;
  cantidad_sugerida_kg: number;
  stock_actual_kg: number;
  demanda_proyectada_kg: number;
  dias_cobertura: number;
  proveedor?: string;
  precio_estimado?: number;
}

export interface PurchaseOrderResponse {
  fecha_generacion: string;
  items: PurchaseOrderItem[];
  total_items: number;
  costo_estimado_total?: number;
  agrupado_por_proveedor?: Record<string, PurchaseOrderItem[]>;
}

// ==================== DATA TYPES ====================

export interface DataStatsResponse {
  total_records: number;
  date_range_start: string;
  date_range_end: string;
  total_days: number;
  business_days: number;
  total_sales: number;
  average_daily_sales: number;
  products_count: number;
  categories_count: number;
}

export interface HistoricalDataResponse {
  count: number;
  data: Array<{
    Fecha: string;
    Producto: string;
    Detalle: string;
    Kilos: string;
    Kilos_num: number;
    Contado: number;
    Tarjeta_Laura: number;
    Tarjeta_Jorge: number;
    Venta_Total: number;
  }>;
}

// ==================== MODEL TYPES ====================

export interface ModelInfo {
  model_key: string;
  model_type: string;
  trained_at?: string;
  metrics?: ModelMetrics;
}

export interface ModelMetrics {
  mae: number;
  rmse: number;
  mape: number;
  r2_score: number;
}

export interface ModelPerformanceComparison {
  models: Array<{
    model_id: string;
    model_type: string;
    mape?: number;
    r2?: number;
    mae?: number;
    rmse?: number;
  }>;
  summary: {
    best_mape?: {
      model_id: string;
      mape: number;
    };
    best_r2?: {
      model_id: string;
      r2: number;
    };
  };
}

// ==================== UPLOAD TYPES ====================

export interface UploadResponse {
  success: boolean;
  message: string;
  filename: string;
  records_processed: number;
  records_added: number;
  duplicates_removed: number;
  total_records: number;
  data_period: {
    start: string;
    end: string;
    unique_days: number;
  };
  model_retrained: boolean;
  model_metrics?: ModelMetrics;
}

// ==================== HEALTH TYPES ====================

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  version: string;
  environment: string;
  models_loaded: number;
  uptime_seconds: number;
}

export interface APIInfo {
  name: string;
  version: string;
  description: string;
  endpoints: Record<string, string>;
  documentation_url: string;
  health_check_url: string;
}

export interface MetricsResponse {
  total_predictions: number;
  total_requests: number;
  average_response_time_ms: number;
  uptime_seconds: number;
  models_loaded: number;
}

// ==================== ANALYSIS TYPES ====================

export interface TopSellersResponse {
  periodo_dias: number;
  granularity: string;
  top_sellers: Array<{
    producto?: string;
    marca?: string;
    Producto?: string;
    Kilos_num: number;
    Venta_Total: number;
  }>;
}

export interface ProductTrendsResponse {
  entity: string;
  granularity: string;
  periodo: {
    inicio: string;
    fin: string;
    dias_con_ventas: number;
  };
  totales: {
    kilos: number;
    ventas: number;
  };
  promedios_diarios: {
    kilos: number;
    ventas: number;
  };
  tendencia_mensual: Array<{
    mes: string;
    Kilos_num: number;
    Venta_Total: number;
  }>;
}

export interface StockCoverageAnalysis {
  periodo_dias: number;
  total_productos: number;
  productos_criticos: number;
  productos_bajos: number;
  productos_ok: number;
  detalle: Array<{
    producto: string;
    categoria: string;
    stock_actual_kg: number;
    demanda_proyectada_kg: number | null;
    demanda_diaria_kg: number | null;
    dias_cobertura: number | null;
    estado: 'OK' | 'BAJO' | 'CRITICO' | 'SIN_PREDICCION';
    error?: string;
  }>;
}

// ==================== UTILITY TYPES ====================

export interface SuccessResponse<T = unknown> {
  message: string;
  data?: T;
}

export interface ErrorResponse {
  detail: string;
}

// ==================== REQUEST TYPES ====================

export interface PredictionRangeRequest {
  start_date: string;
  end_date: string;
  model_type?: string;
}

export interface PredictionNextDaysRequest {
  days: number;
  model_type?: string;
}

// ==================== STOCK IMPORT TYPES ====================

export interface StockImportResponse {
  success: boolean;
  message: string;
  data: {
    imported: number;
    errors: number;
    error_details: string[];
    total_products: number;
  };
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import type { DemandSummary } from "@/types/api";

interface DemandSummaryViewProps {
  data: DemandSummary;
}

export function DemandSummaryView({ data }: DemandSummaryViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Resumen de Demanda ({data.periodo_dias} días)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Por Categoría
          </h4>
          <div className="space-y-2">
            {data.categorias.map((cat) => (
              <div
                key={cat.categoria}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium">{cat.categoria}</span>
                <div className="text-right">
                  <span className="font-mono">
                    {formatNumber(cat.demanda_total_kg, 1)} kg
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({formatNumber(cat.demanda_promedio_diaria_kg, 1)} kg/día)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Marcas Principales
          </h4>
          <div className="space-y-2">
            {data.marcas_principales.map((brand) => (
              <div
                key={brand.marca}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium">{brand.marca}</span>
                <div className="text-right">
                  <span className="font-mono">
                    {formatNumber(brand.demanda_total_kg, 1)} kg
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({formatNumber(brand.demanda_promedio_diaria_kg, 1)} kg/día)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

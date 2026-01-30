"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AvailableEntitiesResponse } from "@/types/api";

interface AvailableEntitiesViewProps {
  data: AvailableEntitiesResponse;
}

const granularityLabels: Record<string, string> = {
  producto: "Productos",
  marca: "Marcas",
  categoria: "Categorías",
};

export function AvailableEntitiesView({ data }: AvailableEntitiesViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {granularityLabels[data.granularity] ?? data.granularity} Disponibles (
          {data.count})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {data.entities.map((entity) => (
            <Badge key={entity.entity} variant="secondary" className="text-xs">
              {entity.entity}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

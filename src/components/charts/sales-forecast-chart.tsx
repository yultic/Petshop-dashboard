"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PredictionResponse } from "@/types/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { formatCurrency, formatNumber, formatDateShort } from "@/lib/utils";

interface SalesForecastChartProps {
  data: PredictionResponse[];
  title?: string;
  description?: string;
  showConfidenceInterval?: boolean;
}

export function SalesForecastChart({
  data,
  title = "Predicción de Ventas",
  description = "Proyección de ventas próximos días hábiles",
  showConfidenceInterval = false,
}: SalesForecastChartProps) {
  const prediction = data[0];
  const isKilos = prediction?.target === "kilos";

  const chartData = prediction?.predictions?.map((item) => ({
    date: formatDateShort(item.date),
    valor: isKilos ? item.predicted_kilos : item.predicted_sales,
    day: item.day_of_week,
  })) || [];

  const formatValue = (value: number) =>
    isKilos ? `${formatNumber(value, 1)} kg` : formatCurrency(value);

  const formatYAxis = (value: number) =>
    isKilos ? `${formatNumber(value, 0)} kg` : `${(value / 1000).toFixed(0)}k`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height="100%" className="h-[250px] sm:h-[350px]">
          {showConfidenceInterval ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <div className="grid gap-2">
                          <div className="font-medium">
                            {payload[0]?.payload.date}
                          </div>
                          <div className="font-bold text-primary">
                            {formatValue(payload[0]?.payload.valor)}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="valor"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <div className="grid gap-2">
                          <div className="font-medium">
                            {payload[0]?.payload.date}
                          </div>
                          <div className="font-bold text-primary">
                            {formatValue(payload[0]?.value as number)}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

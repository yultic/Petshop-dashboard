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
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { formatCurrency, formatDateShort } from "@/lib/utils";

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
  const chartData = data[0]?.predictions?.map((item) => ({
    date :formatDateShort(item.date),
    ventas: item.predicted_sales,
    day: item.day_of_week,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
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
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
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
                          <div className="text-sm text-muted-foreground">
                            {payload[0]?.payload.day}
                          </div>
                          <div className="font-bold text-primary">
                            {formatCurrency(payload[0]?.payload.ventas)}
                          </div>
                          {payload[0]?.payload.lower && (
                            <div className="text-xs text-muted-foreground">
                              Rango: {formatCurrency(payload[0]?.payload.lower)} -{" "}
                              {formatCurrency(payload[0]?.payload.upper)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="upper"
                stackId="1"
                stroke="none"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="ventas"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="lower"
                stackId="1"
                stroke="none"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
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
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
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
                          <div className="text-sm text-muted-foreground">
                            {payload[0]?.payload.day}
                          </div>
                          <div className="font-bold text-primary">
                            {formatCurrency(payload[0]?.value as number)}
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
                dataKey="ventas"
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

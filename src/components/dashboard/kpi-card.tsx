"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency, formatNumber, getTrendColor, getTrendIcon } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  format?: "currency" | "number" | "percentage";
  decimals?: number;
  loading?: boolean;
  className?: string;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel = "vs período anterior",
  icon: Icon,
  format = "number",
  decimals = 2,
  loading = false,
  className,
}: KPICardProps) {
  const formattedValue = () => {
    if (typeof value === "string") return value;
    
    switch (format) {
      case "currency":
        return formatCurrency(value);
      case "percentage":
        return `${formatNumber(value, decimals)}%`;
      case "number":
      default:
        return formatNumber(value, decimals);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("hover:shadow-lg transition-shadow", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && (
            <Icon className="h-4 w-4 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedValue()}</div>
          {change !== undefined && (
            <p className={cn("text-xs mt-2", getTrendColor(change))}>
              <span className="font-medium">
                {getTrendIcon(change)} {change > 0 ? "+" : ""}
                {formatNumber(change, 1)}%
              </span>
              <span className="text-muted-foreground ml-1">{changeLabel}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

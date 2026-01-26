import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("es-SV", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatDate(date: string | Date, formatStr: string = "PP"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
}

export function formatDateShort(date: string | Date): string {
  return formatDate(date, "dd/MM/yyyy");
}

export function formatDateLong(date: string | Date): string {
  return formatDate(date, "PPP");
}

export function getDayOfWeekColor(dayOfWeek: string): string {
  const day = dayOfWeek.toLowerCase();
  if (day === "sábado" || day === "sabado") return "text-blue-600";
  if (day === "domingo") return "text-red-600";
  return "text-gray-700";
}

export function getAlertColor(alertType: string): string {
  switch (alertType) {
    case "agotado":
      return "destructive";
    case "critico":
      return "destructive";
    case "bajo":
      return "default";
    case "ok":
      return "secondary";
    default:
      return "default";
  }
}

export function getAlertBadgeVariant(alertType: string) {
  switch (alertType) {
    case "agotado":
    case "critico":
      return "destructive";
    case "bajo":
      return "outline";
    case "ok":
      return "secondary";
    default:
      return "default";
  }
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function getTrendIcon(percentage: number): "↗" | "↘" | "→" {
  if (percentage > 1) return "↗";
  if (percentage < -1) return "↘";
  return "→";
}

export function getTrendColor(percentage: number): string {
  if (percentage > 0) return "text-green-600";
  if (percentage < 0) return "text-red-600";
  return "text-gray-600";
}

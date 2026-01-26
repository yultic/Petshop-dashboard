import { describe, it, expect } from "vitest";
import {
  cn,
  formatCurrency,
  formatNumber,
  formatDateShort,
  getDayOfWeekColor,
  getAlertColor,
  getAlertBadgeVariant,
  calculatePercentageChange,
  getTrendIcon,
  getTrendColor,
} from "./utils";

describe("cn (classnames utility)", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("should merge tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});

describe("formatCurrency", () => {
  it("should format numbers as USD currency", () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain("1");
    expect(result).toContain("234");
  });

  it("should handle zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
  });

  it("should handle negative numbers", () => {
    const result = formatCurrency(-100);
    expect(result).toContain("100");
  });
});

describe("formatNumber", () => {
  it("should format numbers with specified decimals", () => {
    const result = formatNumber(1234.5678, 2);
    expect(result).toContain("1");
    expect(result).toContain("234");
  });

  it("should default to 2 decimal places", () => {
    const result = formatNumber(100);
    expect(result).toContain("00");
  });
});

describe("formatDateShort", () => {
  it("should format date as dd/MM/yyyy", () => {
    const result = formatDateShort("2024-01-15");
    expect(result).toBe("15/01/2024");
  });
});

describe("getDayOfWeekColor", () => {
  it("should return blue for Saturday", () => {
    expect(getDayOfWeekColor("sábado")).toBe("text-blue-600");
    expect(getDayOfWeekColor("sabado")).toBe("text-blue-600");
  });

  it("should return red for Sunday", () => {
    expect(getDayOfWeekColor("domingo")).toBe("text-red-600");
  });

  it("should return gray for weekdays", () => {
    expect(getDayOfWeekColor("lunes")).toBe("text-gray-700");
    expect(getDayOfWeekColor("martes")).toBe("text-gray-700");
  });
});

describe("getAlertColor", () => {
  it("should return destructive for critical alerts", () => {
    expect(getAlertColor("agotado")).toBe("destructive");
    expect(getAlertColor("critico")).toBe("destructive");
  });

  it("should return default for low alerts", () => {
    expect(getAlertColor("bajo")).toBe("default");
  });

  it("should return secondary for ok alerts", () => {
    expect(getAlertColor("ok")).toBe("secondary");
  });
});

describe("getAlertBadgeVariant", () => {
  it("should return destructive for critical alerts", () => {
    expect(getAlertBadgeVariant("agotado")).toBe("destructive");
    expect(getAlertBadgeVariant("critico")).toBe("destructive");
  });

  it("should return outline for low alerts", () => {
    expect(getAlertBadgeVariant("bajo")).toBe("outline");
  });

  it("should return secondary for ok alerts", () => {
    expect(getAlertBadgeVariant("ok")).toBe("secondary");
  });
});

describe("calculatePercentageChange", () => {
  it("should calculate positive change", () => {
    expect(calculatePercentageChange(150, 100)).toBe(50);
  });

  it("should calculate negative change", () => {
    expect(calculatePercentageChange(50, 100)).toBe(-50);
  });

  it("should handle zero previous value", () => {
    expect(calculatePercentageChange(100, 0)).toBe(100);
    expect(calculatePercentageChange(0, 0)).toBe(0);
  });
});

describe("getTrendIcon", () => {
  it("should return up arrow for positive percentage", () => {
    expect(getTrendIcon(10)).toBe("↗");
  });

  it("should return down arrow for negative percentage", () => {
    expect(getTrendIcon(-10)).toBe("↘");
  });

  it("should return right arrow for near-zero percentage", () => {
    expect(getTrendIcon(0.5)).toBe("→");
    expect(getTrendIcon(-0.5)).toBe("→");
  });
});

describe("getTrendColor", () => {
  it("should return green for positive", () => {
    expect(getTrendColor(10)).toBe("text-green-600");
  });

  it("should return red for negative", () => {
    expect(getTrendColor(-10)).toBe("text-red-600");
  });

  it("should return gray for zero", () => {
    expect(getTrendColor(0)).toBe("text-gray-600");
  });
});

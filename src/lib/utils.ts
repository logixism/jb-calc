import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatValue = (value: number, noShowText = false) => {
  const formatNumber = (num: number) => {
    const formatted = num.toFixed(1);
    return formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted;
  };

  if (value >= 1_000_000_000_000) {
    return noShowText
      ? `$${formatNumber(value / 1_000_000_000_000)}`
      : `$${formatNumber(value / 1_000_000_000_000)}T`;
  }
  if (value >= 1_000_000_000) {
    return noShowText
      ? `$${formatNumber(value / 1_000_000_000)}`
      : `$${formatNumber(value / 1_000_000_000)}B`;
  }
  if (value >= 1_000_000) {
    return noShowText
      ? `$${formatNumber(value / 1_000_000)}`
      : `$${formatNumber(value / 1_000_000)}M`;
  }
  if (value >= 1_000) {
    return noShowText
      ? `$${formatNumber(value / 1_000)}`
      : `$${formatNumber(value / 1_000)}K`;
  }

  return noShowText
    ? `$${value.toLocaleString()}`
    : `$${value.toLocaleString()}`;
};

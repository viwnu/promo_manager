import dayjs from "dayjs";
import type { DatePreset, DateRange } from "../types/dateRange";

function formatDate(value: dayjs.Dayjs): string {
  return value.format("YYYY-MM-DD");
}

export function getPresetRange(preset: DatePreset): { from: string; to: string } {
  const today = dayjs();

  switch (preset) {
    case "today": {
      const date = formatDate(today);
      return { from: date, to: date };
    }
    case "last7Days": {
      return { from: formatDate(today.subtract(6, "day")), to: formatDate(today) };
    }
    case "last30Days": {
      return { from: formatDate(today.subtract(29, "day")), to: formatDate(today) };
    }
    case "custom": {
      const date = formatDate(today);
      return { from: date, to: date };
    }
    default: {
      const date = formatDate(today);
      return { from: date, to: date };
    }
  }
}

export function ensureRange(range: DateRange): { preset: DatePreset; from: string; to: string } {
  if (range.preset !== "custom") {
    const presetRange = getPresetRange(range.preset);
    return { preset: range.preset, ...presetRange };
  }

  if (!range.from || !range.to) {
    const fallback = getPresetRange("last7Days");
    return { preset: "last7Days", ...fallback };
  }

  return { preset: range.preset, from: range.from, to: range.to };
}

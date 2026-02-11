import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { DatePreset, DateRange } from "../types/dateRange";
import { ensureRange } from "../lib/dateRange";

const PRESET_VALUES: DatePreset[] = ["today", "last7Days", "last30Days", "custom"];

function toPreset(value: string | null): DatePreset {
  if (value && PRESET_VALUES.includes(value as DatePreset)) {
    return value as DatePreset;
  }
  return "last7Days";
}

export function useDateRangeSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const range = useMemo<DateRange>(() => {
    const preset = toPreset(searchParams.get("preset"));
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;
    return ensureRange({ preset, from, to });
  }, [searchParams]);

  const setRange = (next: DateRange) => {
    const ensured = ensureRange(next);
    const params = new URLSearchParams(searchParams);
    params.set("preset", ensured.preset);
    params.set("from", ensured.from);
    params.set("to", ensured.to);
    setSearchParams(params, { replace: true });
  };

  return { range, setRange } as const;
}

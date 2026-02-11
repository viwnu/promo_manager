import { Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { DatePreset, DateRange } from "../types/dateRange";
import { ensureRange } from "../lib/dateRange";

const presets: { label: string; value: DatePreset }[] = [
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "last7Days" },
  { label: "Last 30 days", value: "last30Days" },
  { label: "Custom", value: "custom" },
];

type DateRangeFilterProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
};

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const ensured = ensureRange(value);

  const handlePresetChange = (_: React.MouseEvent<HTMLElement>, next: DatePreset | null) => {
    if (!next) {
      return;
    }
    if (next === "custom") {
      onChange({ preset: "custom", from: ensured.from, to: ensured.to });
      return;
    }
    onChange({ preset: next });
  };

  const handleFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ preset: "custom", from: event.target.value, to: ensured.to });
  };

  const handleToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ preset: "custom", from: ensured.from, to: event.target.value });
  };

  return (
    <Stack spacing={2} direction={{ xs: "column", md: "row" }} alignItems={{ xs: "stretch", md: "center" }}>
      <ToggleButtonGroup
        exclusive
        value={ensured.preset}
        onChange={handlePresetChange}
        size="small"
      >
        {presets.map((preset) => (
          <ToggleButton key={preset.value} value={preset.value}>
            {preset.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {ensured.preset === "custom" ? (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="From"
            type="date"
            size="small"
            value={ensured.from}
            onChange={handleFromChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={ensured.to}
            onChange={handleToChange}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      ) : null}
    </Stack>
  );
}

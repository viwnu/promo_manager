export type DatePreset = "today" | "last7Days" | "last30Days" | "custom";

export type DateRange = {
  preset: DatePreset;
  from?: string;
  to?: string;
};

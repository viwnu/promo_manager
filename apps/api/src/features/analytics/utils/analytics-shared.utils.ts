import { AnalyticsDatePreset } from '../types';

export function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function resolveDateRange(options: { datePreset?: AnalyticsDatePreset; from?: Date | string; to?: Date | string }): {
  from?: Date | string;
  to?: Date | string;
} {
  const preset = options.datePreset;
  if (!preset || preset === 'custom') {
    return { from: options.from, to: options.to };
  }

  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (preset === 'today') {
    return { from: end, to: end };
  }

  const days = preset === 'last7Days' ? 6 : 29;
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return { from: start, to: end };
}

export function escapeString(value: string): string {
  return value.replace(/'/g, "''");
}

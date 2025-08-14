export function toISO(d: Date): string { return d.toISOString(); }
export function fromISO(s: string): Date { return new Date(s); }

export function now(): Date { return new Date(); }

export function getDayBoundary(date: Date, tzOffsetMinutes?: number): { start: Date; end: Date } {
  const d = new Date(date);
  const offset = typeof tzOffsetMinutes === 'number' ? tzOffsetMinutes : d.getTimezoneOffset() * -1;
  // Normalize to local day start
  const local = new Date(d.getTime() + offset * 60_000);
  const startLocal = new Date(local.getFullYear(), local.getMonth(), local.getDate(), 0, 0, 0, 0);
  const endLocal = new Date(local.getFullYear(), local.getMonth(), local.getDate(), 23, 59, 59, 999);
  // Convert back to UTC
  const start = new Date(startLocal.getTime() - offset * 60_000);
  const end = new Date(endLocal.getTime() - offset * 60_000);
  return { start, end };
}

export function isBetween(d: Date, start: Date, end: Date): boolean {
  const t = d.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export type SessionStatus = 'active' | 'completed';

export interface Session {
  id: string;
  user_id: string;
  start_at: string; // ISO
  end_at?: string;  // ISO
  duration_minutes?: number;
  status: SessionStatus;
  tags?: string[];
}

const KEY = 'uplift:sessions';
const ACTIVE_KEY = 'uplift:activeSession';

function readAll(): Session[] {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

function writeAll(items: Session[]): void {
  localStorage.setItem(KEY, JSON.stringify(items||[]));
}

export function listSessionsToday(tzOffsetMinutes?: number): Session[] {
  const items = readAll();
  const now = new Date();
  const offset = typeof tzOffsetMinutes === 'number' ? tzOffsetMinutes : now.getTimezoneOffset() * -1;
  const local = new Date(now.getTime() + offset * 60_000);
  const startLocal = new Date(local.getFullYear(), local.getMonth(), local.getDate(), 0, 0, 0, 0);
  const endLocal = new Date(local.getFullYear(), local.getMonth(), local.getDate(), 23, 59, 59, 999);
  const start = new Date(startLocal.getTime() - offset * 60_000);
  const end = new Date(endLocal.getTime() - offset * 60_000);
  return items.filter(s => {
    const endAt = s.end_at ? new Date(s.end_at) : null;
    return endAt ? (endAt >= start && endAt <= end) : false;
  });
}

export function getActive(): { startedAt: number; targetMin?: number } | null {
  try { const raw = localStorage.getItem(ACTIVE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function startSession(userId: string, targetMin = 25): void {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify({ startedAt: Date.now(), targetMin }));
}

export function endSession(userId: string): Session | null {
  const active = getActive(); if (!active) return null;
  const startAt = new Date(active.startedAt);
  const endAt = new Date();
  const duration = Math.max(0, Math.round((endAt.getTime() - startAt.getTime()) / 60000));
  const sess: Session = { id: String(active.startedAt), user_id: userId, start_at: startAt.toISOString(), end_at: endAt.toISOString(), duration_minutes: duration, status: 'completed' };
  const items = readAll(); items.push(sess); writeAll(items);
  localStorage.removeItem(ACTIVE_KEY);
  return sess;
}


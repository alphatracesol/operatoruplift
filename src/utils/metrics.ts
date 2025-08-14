import { DEFAULTS } from '../constants';
import { getDayBoundary, fromISO } from './time';

export function computeTokensFromMinutes(minutes: number, tokensPerHour = DEFAULTS.TOKENS_PER_HOUR): number {
  return Math.floor((minutes || 0) / 60) * tokensPerHour;
}

export function computePoints(minutes: number, tasksDone: number, cfg = DEFAULTS): number {
  const fromFocus = Math.floor((minutes || 0) / 5) * cfg.POINTS_PER_5MIN_FOCUS;
  const fromTasks = (tasksDone || 0) * cfg.POINTS_PER_TASK;
  return fromFocus + fromTasks;
}

export function dayStreakUpdate(currentStreak: number, minutesToday: number, minMinutes = DEFAULTS.STREAK_MIN_MINUTES): number {
  return minutesToday >= minMinutes ? Math.max(1, (currentStreak || 0) + 1) : (currentStreak || 0);
}

export function sumTodayMinutes(sessionISOs: { start_at: string; end_at?: string; duration_minutes?: number }[], tzOffsetMinutes?: number): number {
  const { start, end } = getDayBoundary(new Date(), tzOffsetMinutes);
  return (sessionISOs || []).reduce((acc, s) => {
    if (s.end_at) {
      const endAt = fromISO(s.end_at);
      if (endAt >= start && endAt <= end) return acc + (s.duration_minutes || 0);
    }
    return acc;
  }, 0);
}

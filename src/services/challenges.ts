import { DEFAULTS } from '../constants';

const KEY = 'uplift:challengeAwarded:';

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function isDailyRewarded(): boolean {
  return !!localStorage.getItem(KEY + todayKey());
}

export function markDailyRewarded(): void {
  localStorage.setItem(KEY + todayKey(), '1');
}

export function targetMinutes(): number { return DEFAULTS.CHALLENGE_TARGET_HOURS * 60; }


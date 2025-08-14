import { STORAGE_KEYS } from '../constants';

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  timezone?: string;
  current_streak: number;
  longest_streak: number;
  tokens: number;
  points: number;
  level: number;
  badges: string[];
}

export function getUser(): UserProfile | null {
  try { const raw = localStorage.getItem(STORAGE_KEYS.USER); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function saveUser(u: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
}

export function updateUser(patch: Partial<UserProfile>): UserProfile {
  const curr = getUser() || { id: 'local', name: 'Operator', current_streak: 0, longest_streak: 0, tokens: 0, points: 0, level: 1, badges: [] } as UserProfile;
  const next = { ...curr, ...patch } as UserProfile;
  saveUser(next);
  return next;
}

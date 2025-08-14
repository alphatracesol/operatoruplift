# Data Model – Operator Uplift (Mission Control)

TypeScript interfaces for core domain + computed metrics.

```ts
// docs only – reference for services and hooks

export interface User {
  id: string;
  name: string;
  avatar?: string;
  timezone?: string; // IANA, e.g., 'America/Los_Angeles'
  current_streak: number; // days
  longest_streak: number; // days
  tokens: number; // walletless in‑app balance mirror
  points: number; // XP-like points
  level: number;
  badges: string[];
}

export type FocusSessionStatus = 'active' | 'completed';
export interface FocusSession {
  id: string;
  user_id: string;
  start_at: string; // ISO
  end_at?: string;  // ISO
  duration_minutes?: number; // computed when completed
  status: FocusSessionStatus;
  tags?: string[];
}

export type TaskStatus = 'todo' | 'doing' | 'done';
export interface Task {
  id: string;
  user_id: string;
  title: string;
  status: TaskStatus;
  pomodoros?: number; // optional count
  due_at?: string; // ISO
  completed_at?: string; // ISO
  points_awarded?: number; // set when done
}

export type ChallengeType = 'daily_focus_goal';
export interface Challenge {
  id: string;
  user_id: string;
  type: ChallengeType;
  target_hours: number; // default 4
  reward_tokens: number; // default 100
  start_at: string; // ISO (day start local)
  end_at: string;   // ISO (day end local)
  user_progress_hours: number; // updated live
  rewarded?: boolean; // once/day
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'all-time';
export interface LeaderboardEntry {
  user_id: string;
  period: LeaderboardPeriod;
  points: number;
  rank: number;
}

// Computed metrics
export interface TodayProgress {
  minutes_focused: number; // sum of completed sessions today
  tasks_completed: number; // count of done tasks today
  tasks_total: number;     // tasks with due_at today or created today
}

export interface StreakConfig {
  min_minutes_per_day: number; // default 25
}

export interface AwardRules {
  tokens_per_hour: number; // default 25
  points_per_task: number; // default 10
  points_per_5min_focus: number; // default 1
}

// Utility definitions
export interface DayBoundary {
  start: string; // ISO
  end: string;   // ISO
}
```

## Metric Definitions
- **Day streak**: consecutive days where `minutes_focused >= min_minutes_per_day`.
- **Tokens**: `floor(total_minutes / 60) * tokens_per_hour` + challenge rewards when `user_progress_hours >= target_hours` and not yet rewarded.
- **Points**: `tasks_done * points_per_task + floor(total_minutes / 5) * points_per_5min_focus`.
- **Today’s progress**: computed from sessions/tasks whose timestamps fall within timezone‑aware day boundaries.

## Defaults (config/constants)
```ts
export const DEFAULTS = {
  STREAK_MIN_MINUTES: 25,
  CHALLENGE_TARGET_HOURS: 4,
  CHALLENGE_REWARD_TOKENS: 100,
  TOKENS_PER_HOUR: 25,
  POINTS_PER_TASK: 10,
  POINTS_PER_5MIN_FOCUS: 1,
};
```

## Notes
- Persist active session (start ISO + running) to survive refresh.
- Use timezone from `user.timezone` for day boundaries. Fallback: browser tz.
- All calculations should be handled by pure functions with unit tests.

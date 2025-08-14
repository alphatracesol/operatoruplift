# Operator Uplift – Mission Control (/app) Audit

Scope: `app.html` (Mission Control dashboard), related Netlify Functions under `netlify/functions/**`, and token page widgets that drive dashboard KPIs.

Date: {{today}}

## Summary
Mission Control is largely functional after the recent reintegration. However, several core UX/data gaps remain across empty/loading/error states, real data wiring, actions with no effects, metrics definitions, and real‑time updates. This document prioritizes the work using MoSCoW and cites exact file paths/sections.

## MoSCoW Priorities

### Must Have
- Empty states with meaningful copy/CTA
  - `app.html` Dashboard cards around L1200–L1275
    - Today’s Progress: if no focus sessions/tasks today → show icon, short explanation, “Start Focus Session”/“Add Task” CTA
    - Active Challenges: if none/progress 0 → copy and CTA “Start a 25‑min block”
    - Top Performers: if no data → CTA “Invite teammates” (stub)

- Loading + error states
  - Add skeletons/spinners for first load; inline error with retry
  - Files: `app.html` cards (L1218–L1263, L1264–L1274), `fetchBurnFeed`, `renderPendingRedemptions`

- Real user data wiring
  - Auth/profile/progress/session wiring: `app.html` auth handlers (L1715–L1795), `loadUserData` (L1789+)
  - Persist/restore active focus session across reloads (localStorage key)

- Actions that currently no‑op or incomplete
  - Start Focus Session: `startQuickBurn` (L2949–L2952) → must guard against multiple active, show confirm on end, update aggregates (today focus minutes, streak, tokens, points)
  - Tasks today: no add/complete UI; add quick entry, checkboxes, (optional) drag reorder
  - Join Challenges: add stub action updating challenge progress in localStorage/db

- Metric definitions & calculations (centralized)
  - Day streak (≥ 25 min/day), Tokens (per hour + challenge), Points (task, session, challenge), Today’s Progress
  - Extract to constants + pure utils; surface tooltips
  - Files to change: add `src/utils/time.ts`, `src/constants.ts`, `src/utils/metrics.ts`; reference in `app.html`

- Real‑time/background updates
  - Invalidate today aggregates on session end/task complete
  - Poll pending redemptions (every 2 minutes) – in `app.html` (already wired, ensure debounce and cleanup)

- Navigation/IA fixes
  - Leaderboard route added (done). Add Settings route (done). Ensure nav item states sync with view creation (L1927–L1939, L1968–L1984)

### Should Have
- Data layer (mock or backend services)
  - If backend absent, provide local‑first mock services with JSDoc types: `services/user.ts`, `services/sessions.ts`, `services/tasks.ts`, `services/challenges.ts`, `services/leaderboard.ts` (see deliverables)
  - Hooks for stateful logic: `hooks/useFocusSession.ts`, `hooks/useTodayProgress.ts`, `hooks/useChallenges.ts`, `hooks/useLeaderboard.ts`

- Accessibility
  - Focus timer with `aria-live=polite`; keyboard operability; button labels
  - Color contrast for orange/black theme (audit primary/accent usage in `:root` vars)

- Telemetry & guards
  - Log session start/end, task completion, challenge award; debounce writes; deduplicate events

### Could Have
- Drag‑to‑prioritize tasks (keyboard fallback)
- Leveling system (points → levels)
- Toasts enriched with links to history views

### Won’t Have (now)
- Full React/TypeScript migration. The SPA remains inline HTML/JS until a dedicated Vite/Next app is introduced.

## File‑level Findings & Required Edits

- `app.html`
  - Dashboard view cards: L1201–L1275
    - Add empty/loading/error variants per card
    - Add “Add Task” quick entry (input + Add button) and render today tasks
  - Focus session engine: L2194–L2290, L2852–L2895
    - Persist active session to localStorage with start timestamp and duration; resume on load
    - Guard multiple starts; confirm on ending
    - On end: update Today’s Focus, streak, tokens, points; show toast
  - Challenges: L1244–L1261
    - Daily focus goal progress bar; award once per day (100 tokens) when reaching 4h
  - Leaderboard View: added (OK). Add empty state CTA
  - Settings View: added (OK). Persist selections and apply to AI responses (style/tone)
  - Redemptions & Burn feed: added; add loading/error states

- `netlify/functions/api.js`
  - Endpoints present for `points/rate`, `points/redeem`, `auth/phantom/*` (OK)
  - Added: `token/supply`, `burns/history`, `fees/summary`, `buybacks/log` (ensure env vars and IAM)

- `uplift-token.html`
  - Live fee routing & proofs added; verify weekly snapshots (cron/worker) align with Monday publication

## Open Questions / Dependencies
- Confirm environment variables: `UPLIFT_MINT`, `HELIUS_RPC_URL` or `HELIUS_API_KEY`
- Confirm Firestore schema for user/day aggregates and redemptions
- Decide on local‑first vs backend for sessions/tasks/challenges during MVP

## Acceptance Criteria (Demo)
- Start/End session updates Today’s Focus, Streak, Tokens, Points, and Challenge progress (once/day award)
- Tasks can be added/completed; Today’s Progress updates live
- Leaderboard shows data or clear empty state
- All widgets: loading, error, empty states; no console errors; state survives refresh



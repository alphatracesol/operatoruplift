export interface LeaderboardRow { user: string; points: number; rank: number }

export async function fetchDailyLeaderboard(): Promise<LeaderboardRow[]> {
  // Mock data for now; replace with backend call
  return [
    { user: 'Alex Champion', points: 15420, rank: 1 },
    { user: 'Sarah Master', points: 14200, rank: 2 },
    { user: 'Mike Pro', points: 13500, rank: 3 },
  ];
}


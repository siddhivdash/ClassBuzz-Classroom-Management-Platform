export interface BadgeItem {
  id: string;
  badgeId: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedAt: string | null;
  points: number;
  userId: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  rank: number;
  badgeCount: number;
  points: number;
}

export interface StudentSearchResult {
  id: string;
  name: string;
  email: string;
  role: "student";
}
// ─── Analytics ────────────────────────────────────────────────────────────────
// Patterns are computed from Event streams — never stored as source of truth.
// Insights are human-readable statements generated from Patterns.

export interface BehaviorPattern {
  behaviorId: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;        // percentage 0-100
  consistencyScore: number;      // weighted score 0-100
  dayOfWeekBreakdown: DayOfWeekBreakdown;
  totalEvents: number;
  computedAt: Date;
}

export interface DayOfWeekBreakdown {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

export interface BehaviorInsight {
  behaviorId: string;
  insights: string[];
  generatedAt: Date;
}

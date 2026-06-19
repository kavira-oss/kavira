// ─── Streak Calculator ────────────────────────────────────────────────────────
// Pure function — no DB dependency.
// Takes an array of event dates and returns current + longest streak.
// This is the reference implementation; the production analytics service
// will compute this via a PostgreSQL window function query instead.

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
}

/**
 * Calculate current and longest streaks from an array of event dates.
 * Deduplicates same-day events, sorts descending, walks backwards.
 */
export function calculateStreak(eventDates: Date[]): StreakResult {
  if (!eventDates.length) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Normalise to midnight, deduplicate, sort descending
  const uniqueDays = Array.from(
    new Set(
      eventDates.map((d) => {
        const normalised = new Date(d);
        normalised.setHours(0, 0, 0, 0);
        return normalised.getTime();
      }),
    ),
  )
    .sort((a, b) => b - a)
    .map((ts) => new Date(ts));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const MS_PER_DAY = 86_400_000;

  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 1;

  // Check if the most recent event is today or yesterday
  const mostRecent = uniqueDays[0];
  const daysDiff = Math.round((today.getTime() - mostRecent.getTime()) / MS_PER_DAY);

  if (daysDiff > 1) {
    // Streak already broken — current streak is 0
    currentStreak = 0;
  } else {
    currentStreak = 1;
  }

  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = Math.round(
      (uniqueDays[i - 1].getTime() - uniqueDays[i].getTime()) / MS_PER_DAY,
    );

    if (diff === 1) {
      streak++;
      if (i < uniqueDays.length && currentStreak > 0) {
        currentStreak = streak;
      }
    } else {
      longestStreak = Math.max(longestStreak, streak);
      streak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, streak);
  currentStreak = Math.min(currentStreak, longestStreak);

  return { currentStreak, longestStreak };
}

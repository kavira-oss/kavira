// ─── Date Utilities ───────────────────────────────────────────────────────────

/**
 * Normalise a date to midnight (start of day) in local time.
 */
export function toStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Check if two dates fall on the same calendar day.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Return the day-of-week key (monday, tuesday, ...) for a given date.
 */
export function getDayOfWeekKey(date: Date): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
}

/**
 * Check if a date is today.
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Return the number of whole days between two dates.
 */
export function daysBetween(a: Date, b: Date): number {
  const MS_PER_DAY = 86_400_000;
  const start = toStartOfDay(a).getTime();
  const end = toStartOfDay(b).getTime();
  return Math.abs(Math.round((end - start) / MS_PER_DAY));
}

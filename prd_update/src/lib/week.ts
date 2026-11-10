// Weeks run Monday to Sunday in the athlete's local time.
export function startOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const daysSinceMonday = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - daysSinceMonday);
  return d;
}

export function weekKey(date: Date = new Date()): string {
  const d = startOfWeek(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function previousWeekStart(date: Date = new Date()): Date {
  const d = startOfWeek(date);
  d.setDate(d.getDate() - 7);
  return d;
}

export function minutesInRange(
  sessions: { minutes: number; completedAt: number }[],
  from: Date,
  to: Date
): number {
  const a = from.getTime();
  const b = to.getTime();
  return sessions.reduce(
    (sum, s) => (s.completedAt >= a && s.completedAt < b ? sum + s.minutes : sum),
    0
  );
}

export function minutesThisWeek(sessions: { minutes: number; completedAt: number }[]): number {
  const start = startOfWeek();
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return minutesInRange(sessions, start, end);
}

export function minutesLastWeek(sessions: { minutes: number; completedAt: number }[]): number {
  return minutesInRange(sessions, previousWeekStart(), startOfWeek());
}

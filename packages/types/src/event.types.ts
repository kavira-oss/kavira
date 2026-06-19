// ─── Event ────────────────────────────────────────────────────────────────────
// Events are the atomic unit of data in Kavira.
// Each event represents a single timestamped occurrence of a Behavior.
// Events are append-only — they are never edited, only added or retracted.

export interface BehaviorEvent {
  id: string;
  behaviorId: string;
  occurredAt: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface LogEventDto {
  occurredAt: Date;
  metadata?: Record<string, unknown>;
}

// ─── Behavior ─────────────────────────────────────────────────────────────────

export type BehaviorFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';

export type BehaviorCategory =
  | 'health'
  | 'fitness'
  | 'learning'
  | 'mindfulness'
  | 'productivity'
  | 'social'
  | 'other';

export interface Behavior {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: BehaviorCategory;
  frequency: BehaviorFrequency;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBehaviorDto {
  title: string;
  description?: string;
  category: BehaviorCategory;
  frequency: BehaviorFrequency;
}

export interface UpdateBehaviorDto {
  title?: string;
  description?: string;
  category?: BehaviorCategory;
  frequency?: BehaviorFrequency;
  isArchived?: boolean;
}

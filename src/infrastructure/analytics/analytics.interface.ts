export type AnalyticsEvent = 
  | 'goal_created'
  | 'deposit_added'
  | 'goal_detail_viewed'
  | 'milestone_reached'
  | 'feature_flag_evaluated';

export interface AnalyticsProperties {
  [key: string]: string | number | boolean | null;
}

export interface AnalyticsProvider {
  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void;
  identify?(userId: string): void;
  reset?(): void;
}

export interface AnalyticsService {
  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void;
  setProvider(provider: AnalyticsProvider): void;
  getEventLog(): Array<{ event: AnalyticsEvent; properties?: AnalyticsProperties; timestamp: Date }>;
}

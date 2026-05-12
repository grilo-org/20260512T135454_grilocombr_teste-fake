import {
  AnalyticsService,
  AnalyticsProvider,
  AnalyticsEvent,
  AnalyticsProperties,
} from './analytics.interface';
import { ConsoleAnalyticsProvider } from './console-analytics.provider';

class AnalyticsServiceImpl implements AnalyticsService {
  private provider: AnalyticsProvider;
  private eventLog: Array<{ event: AnalyticsEvent; properties?: AnalyticsProperties; timestamp: Date }>;

  constructor(defaultProvider: AnalyticsProvider) {
    this.provider = defaultProvider;
    this.eventLog = [];
  }

  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
    this.eventLog.push({
      event,
      properties,
      timestamp: new Date(),
    });
    this.provider.track(event, properties);
  }

  setProvider(provider: AnalyticsProvider): void {
    this.provider = provider;
  }

  getEventLog(): Array<{ event: AnalyticsEvent; properties?: AnalyticsProperties; timestamp: Date }> {
    return [...this.eventLog];
  }

  clearLog(): void {
    this.eventLog = [];
  }
}

export const analyticsService = new AnalyticsServiceImpl(new ConsoleAnalyticsProvider());

export { AnalyticsProvider } from './analytics.interface';
export { ConsoleAnalyticsProvider } from './console-analytics.provider';

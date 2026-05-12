import { AnalyticsProvider, AnalyticsEvent, AnalyticsProperties } from './analytics.interface';

export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  private prefix = '[Analytics]';

  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
    const timestamp = new Date().toISOString();
    if (properties) {
      console.log(`${this.prefix} [${timestamp}] Event: ${event}`, properties);
    } else {
      console.log(`${this.prefix} [${timestamp}] Event: ${event}`);
    }
  }

  identify(userId: string): void {
    console.log(`${this.prefix} User identified: ${userId}`);
  }

  reset(): void {
    console.log(`${this.prefix} User reset`);
  }
}

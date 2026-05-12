import { analyticsService } from '../../src/infrastructure/analytics';

describe('Analytics Module', () => {
  beforeEach(() => {
    analyticsService.clearLog();
  });

  describe('track', () => {
    it('should track event with properties', () => {
      analyticsService.track('goal_created', {
        goal_id: '123',
        goal_name: 'Test Goal',
        target_value: 1000,
        category: 'emergencia',
      });

      const log = analyticsService.getEventLog();
      expect(log).toHaveLength(1);
      expect(log[0].event).toBe('goal_created');
      expect(log[0].properties?.goal_id).toBe('123');
    });

    it('should track event without properties', () => {
      analyticsService.track('milestone_reached');

      const log = analyticsService.getEventLog();
      expect(log).toHaveLength(1);
      expect(log[0].event).toBe('milestone_reached');
      expect(log[0].properties).toBeUndefined();
    });

    it('should track multiple events in order', () => {
      analyticsService.track('goal_created', { name: 'Goal 1' });
      analyticsService.track('deposit_added', { amount: 100 });
      analyticsService.track('milestone_reached');

      const log = analyticsService.getEventLog();
      expect(log).toHaveLength(3);
      expect(log[0].event).toBe('goal_created');
      expect(log[1].event).toBe('deposit_added');
      expect(log[2].event).toBe('milestone_reached');
    });
  });

  describe('getEventLog', () => {
    it('should return empty array when no events tracked', () => {
      expect(analyticsService.getEventLog()).toEqual([]);
    });

    it('should include timestamp in log entries', () => {
      analyticsService.track('goal_created');
      const log = analyticsService.getEventLog();
      expect(log[0].timestamp).toBeInstanceOf(Date);
    });
  });

  describe('clearLog', () => {
    it('should clear event log', () => {
      analyticsService.track('goal_created');
      analyticsService.track('deposit_added');
      expect(analyticsService.getEventLog()).toHaveLength(2);

      analyticsService.clearLog();
      expect(analyticsService.getEventLog()).toHaveLength(0);
    });
  });
});

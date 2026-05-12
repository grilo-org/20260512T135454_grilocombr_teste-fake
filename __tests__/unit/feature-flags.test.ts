import { featureFlagsService, LocalFeatureFlagsProvider } from '../../src/infrastructure/feature-flags';
import { FeatureFlag, FeatureFlagName } from '../../src/infrastructure/feature-flags/feature-flags.interface';

describe('Feature Flags Module', () => {
  describe('isEnabled', () => {
    it('should return true for enabled flag', () => {
      const result = featureFlagsService.isEnabled('show_milestone_celebration');
      expect(result).toBe(true);
    });

    it('should track flag evaluation in analytics', () => {
      featureFlagsService.isEnabled('show_milestone_celebration');
    });
  });

  describe('getFlag', () => {
    it('should return flag details', () => {
      const flag = featureFlagsService.getFlag('show_milestone_celebration');
      expect(flag).toBeDefined();
      expect(flag?.name).toBe('show_milestone_celebration');
      expect(flag?.enabled).toBe(true);
    });
  });

  describe('getAllFlags', () => {
    it('should return all flags', () => {
      const flags = featureFlagsService.getAllFlags();
      expect(flags.length).toBeGreaterThan(0);
    });
  });

  describe('LocalFeatureFlagsProvider', () => {
    it('should work with custom config', () => {
      const customConfig = {
        flags: [
          {
            name: 'show_milestone_celebration' as FeatureFlagName,
            enabled: false,
            description: 'Disabled flag',
          },
        ],
        version: '1.0.0',
        lastUpdated: '2026-01-01T00:00:00Z',
      };

      const provider = new LocalFeatureFlagsProvider(customConfig);
      expect(provider.isEnabled('show_milestone_celebration')).toBe(false);
    });

    it('should return false for non-existent flag', () => {
      const provider = new LocalFeatureFlagsProvider({
        flags: [],
        version: '1.0.0',
        lastUpdated: '2026-01-01T00:00:00Z',
      });
      expect(provider.isEnabled('show_milestone_celebration')).toBe(false);
    });
  });
});

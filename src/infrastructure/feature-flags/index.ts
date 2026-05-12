import {
  FeatureFlagService,
  FeatureFlagsProvider,
  FeatureFlag,
  FeatureFlagName,
} from './feature-flags.interface';
import { LocalFeatureFlagsProvider } from './feature-flags.provider';
import { analyticsService } from '../analytics';

class FeatureFlagsServiceImpl implements FeatureFlagService {
  private provider: FeatureFlagsProvider;

  constructor(defaultProvider: FeatureFlagsProvider) {
    this.provider = defaultProvider;
  }

  isEnabled(flagName: FeatureFlagName): boolean {
    const result = this.provider.isEnabled(flagName);
    analyticsService.track('feature_flag_evaluated', {
      flag_name: flagName,
      result: result,
    });
    return result;
  }

  getFlag(flagName: FeatureFlagName): FeatureFlag | undefined {
    return this.provider.getFlag(flagName);
  }

  getAllFlags(): FeatureFlag[] {
    return this.provider.getAllFlags();
  }

  setProvider(provider: FeatureFlagsProvider): void {
    this.provider = provider;
  }
}

export const featureFlagsService = new FeatureFlagsServiceImpl(
  new LocalFeatureFlagsProvider()
);

export { FeatureFlagsProvider } from './feature-flags.interface';
export { LocalFeatureFlagsProvider } from './feature-flags.provider';

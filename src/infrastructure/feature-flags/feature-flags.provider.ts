import {
  FeatureFlagsProvider,
  FeatureFlag,
  FeatureFlagName,
} from './feature-flags.interface';
import flagsConfig from './flags.json';

export class LocalFeatureFlagsProvider implements FeatureFlagsProvider {
  private flags: Map<FeatureFlagName, FeatureFlag>;

  constructor(config?: typeof flagsConfig) {
    this.flags = new Map();
    const configToUse = config || flagsConfig;
    configToUse.flags.forEach((flag) => {
      this.flags.set(flag.name as FeatureFlagName, flag as FeatureFlag);
    });
  }

  isEnabled(flagName: FeatureFlagName): boolean {
    const flag = this.flags.get(flagName);
    return flag?.enabled ?? false;
  }

  getFlag(flagName: FeatureFlagName): FeatureFlag | undefined {
    return this.flags.get(flagName);
  }

  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }
}

export type FeatureFlagName = 'show_milestone_celebration';

export interface FeatureFlag {
  name: FeatureFlagName;
  enabled: boolean;
  description?: string;
}

export interface FeatureFlagsConfig {
  flags: FeatureFlag[];
  version: string;
  lastUpdated: string;
}

export interface FeatureFlagsProvider {
  isEnabled(flagName: FeatureFlagName): boolean;
  getFlag(flagName: FeatureFlagName): FeatureFlag | undefined;
  getAllFlags(): FeatureFlag[];
  refresh?(): Promise<void>;
}

export interface FeatureFlagService {
  isEnabled(flagName: FeatureFlagName): boolean;
  getFlag(flagName: FeatureFlagName): FeatureFlag | undefined;
  getAllFlags(): FeatureFlag[];
  setProvider(provider: FeatureFlagsProvider): void;
}

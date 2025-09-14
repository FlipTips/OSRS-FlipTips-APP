// A simple helper hook to expose feature flags from a JSON file.  When new
// flags are added to config/flags.json, they will be typed as boolean keys.
import flags from '../config/flags.json';

export type FeatureFlags = Record<string, boolean>;

export function useFlags(): FeatureFlags {
  return flags as FeatureFlags;
}
import type { AliasToken } from './alias';

export type OverrideToken<CompTokenMap extends Object> = {
  [key in keyof CompTokenMap]: Partial<CompTokenMap[key]> & Partial<AliasToken>;
};

/** Final token which contains the components level override */
export type GlobalToken<CompTokenMap extends Object> = AliasToken & CompTokenMap;
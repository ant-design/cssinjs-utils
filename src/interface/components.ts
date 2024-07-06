import { AliasToken } from './alias';

export type DefaultCompTokenMap = Record<string, any>;

export type OverrideToken<CompTokenMap extends DefaultCompTokenMap> = {
  [key in keyof CompTokenMap]: Partial<CompTokenMap[key]> & Partial<AliasToken>;
};

/** Final token which contains the components level override */
export type GlobalToken<CompTokenMap extends DefaultCompTokenMap> = AliasToken & CompTokenMap;
import type { AnyObject } from '../_util/type';
import { AliasToken } from './alias';

export type OverrideToken<CompTokenMap extends AnyObject> = {
  [key in keyof CompTokenMap]: Partial<CompTokenMap[key]> & Partial<AliasToken>;
};

/** Final token which contains the components level override */
export type GlobalToken<CompTokenMap extends AnyObject> = AliasToken & CompTokenMap;
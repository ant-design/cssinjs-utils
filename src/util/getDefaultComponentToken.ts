import { merge as mergeToken } from './statistic';
import type { GetDefaultToken, GetDefaultTokenFn } from './genStyleUtils';
import type { OverrideTokenMap, TokenMap, TokenMapKey } from '../interface';

export default function getDefaultComponentToken<CompTokenMap extends TokenMap, C extends TokenMapKey<CompTokenMap>>(
  component: C,
  token: OverrideTokenMap<CompTokenMap>,
  getDefaultToken: GetDefaultToken<CompTokenMap, C>,
): any {
  if (typeof getDefaultToken === 'function') {
    return (getDefaultToken as GetDefaultTokenFn<CompTokenMap, C>)(mergeToken<any>(token, token[component] ?? {}));
  }
  return getDefaultToken ?? {};
};
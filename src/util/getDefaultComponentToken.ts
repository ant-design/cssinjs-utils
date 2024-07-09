import { merge as mergeToken } from './statistic';
import type { GlobalToken } from '../interface';
import type { OverrideComponent, GetDefaultToken, GetDefaultTokenFn } from './genStyleUtils';

export default function getDefaultComponentToken<CompTokenMap, C extends OverrideComponent<CompTokenMap>>(
  component: C,
  token: GlobalToken<CompTokenMap>,
  getDefaultToken: GetDefaultToken<CompTokenMap, C>,
): any {
  if (typeof getDefaultToken === 'function') {
    return (getDefaultToken as GetDefaultTokenFn<CompTokenMap, C>)(mergeToken<any>(token, token[component] ?? {}));
  }
  return getDefaultToken ?? {};
};